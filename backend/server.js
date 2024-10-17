import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { UserChat } from "./models/userChats.js";
import { User } from "./models/user.js";
import Chat from "./models/chat.js";
import "dotenv/config";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import { Resume } from "./models/resumeSchema.js";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clerk middleware for authentication
app.use(ClerkExpressWithAuth());

// CORS configuration
const allowedOrigins = [process.env.CLIENT_URL, process.env.SERVER_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// MongoDB connection function
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Webhook route for user creation
app.post(
  "/get/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    try {
      const payloadString = req.body.toString();
      const svixHeaders = req.headers;

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
      const evt = wh.verify(payloadString, svixHeaders);

      const { id, ...attributes } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.created") {
        const firstName = attributes.first_name;
        const lastName = attributes.last_name;
        const emailAddresses = attributes.email_addresses.map(
          (addr) => addr.email_address
        );
        const email = emailAddresses[0];

        const user = new User({ clerkUserId: id, firstName, lastName, email });
        await user.save();
        console.log("User created:", firstName, lastName, email);
      }

      res.status(200).json({ success: true, message: "Webhook received" });
    } catch (err) {
      console.error("Error handling webhook:", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// JSON body parser
app.use(express.json());

// Socket.IO setup for real-time collaboration
const io = new Server(3001, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

// Socket.io connections and document handling
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.error("No userId provided");
    socket.disconnect();
    return;
  }

  console.log(`User connected with ID: ${userId}`);

  socket.on("get-document", async (documentId) => {
    try {
      const document = await findOrCreateDocument(documentId, userId);
      socket.join(documentId);
      socket.emit("load-document", document?.data || defaultValue);

      socket.on("send-changes", (delta) => {
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });

      socket.on("save-document", async (data) => {
        await Resume.findByIdAndUpdate(
          documentId,
          { data, chatHistory: document.chatHistory },
          { upsert: true }
        );
      });
    } catch (error) {
      console.error("Error handling document events:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected with ID: ${userId}`);
  });
});

// Helper function to find or create a document
async function findOrCreateDocument(documentId, userId) {
  try {
    let document = await Resume.findById(documentId);
    if (!document) {
      document = new Resume({ _id: documentId, userId, data: defaultValue });
      await document.save();
    }
    return document;
  } catch (error) {
    console.error("Error finding or creating document:", error);
    throw error;
  }
}

// Resume API routes
app.get("/api/resume/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Error fetching resume" });
  }
});

app.put("/api/resume/:id", ClerkExpressWithAuth(), async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.userId;
  const { content, chatMessage, name } = req.body;

  try {
    let updateOperation = {};
    if (content) updateOperation.data = content;
    if (chatMessage && Array.isArray(chatMessage))
      updateOperation.$push = { chatHistory: { $each: chatMessage } };

    const existingResume = await Resume.findById(id);
    if (!existingResume) {
      const newResume = new Resume({
        _id: id,
        userId,
        name: name || "Untitled",
        ...updateOperation,
      });
      await newResume.save();
      return res.json(newResume);
    }

    if (name && name !== existingResume.name) updateOperation.name = name;
    await Resume.updateOne({ _id: id }, updateOperation);
    const updatedResume = await Resume.findById(id);
    res.json(updatedResume);
  } catch (error) {
    console.error("Error updating resume:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

app.delete("/api/resume/:id", async (req, res) => {
  try {
    const deletedResume = await Resume.findByIdAndDelete(req.params.id);
    if (!deletedResume)
      return res.status(404).json({ error: "Resume not found" });
    res.json({
      message: "Resume deleted successfully",
      content: deletedResume,
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ImageKit Authentication
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Chat-related routes
app.post("/api/chat", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();
    const userChats = await UserChat.find({ userId });

    if (!userChats.length) {
      const newUserChats = new UserChat({
        userId,
        chats: [{ _id: savedChat._id, title: text.substring(0, 40) }],
      });
      await newUserChats.save();
    } else {
      await UserChat.updateOne(
        { userId },
        {
          $push: {
            chats: { _id: savedChat._id, title: text.substring(0, 40) },
          },
        }
      );
    }

    res.status(201).send(newChat._id);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const userChats = await UserChat.findOne({ userId });
    res.status(200).send(userChats?.chats || []);
  } catch (err) {
    console.error("Error fetching user chats:", err);
    res.status(500).send("Error fetching user chats!");
  }
});

app.get("/api/chat/:id", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) return res.status(404).send("Chat not found!");
    res.status(200).send(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chat/:id", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question ? [{ role: "user", parts: [{ text: question }] }] : []),
    ...(answer ? [{ role: "assistant", parts: [{ text: answer, img }] }] : []),
  ];

  try {
    await Chat.updateOne(
      { _id: req.params.id, userId },
      { $push: { history: { $each: newItems } } }
    );
    res.send("Chat updated successfully!");
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).send("Error updating chat!");
  }
});

// Start the server and connect to MongoDB
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToMongoDB();
});
