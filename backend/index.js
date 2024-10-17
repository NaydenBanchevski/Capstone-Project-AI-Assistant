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
app.use(ClerkExpressWithAuth());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "https://perscholas-ai-assistant-hcrf.vercel.app",
    origin: "https://capstone-project-ai-assistant-1.onrender.com",
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

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
      console.log(evt.data);

      if (eventType === "user.created") {
        const firstName = attributes.first_name;
        const lastName = attributes.last_name;

        const emailAddresses = attributes.email_addresses.map(
          (addr) => addr.email_address
        );
        const email = emailAddresses[0];

        console.log(firstName, lastName, email);

        const user = new User({
          clerkUserId: id,
          firstName: firstName,
          lastName: lastName,
          email: email,
        });

        await user.save();
        console.log("User is created");
      }

      res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    } catch (err) {
      console.error("Error handling webhook:", err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
);

app.use(express.json());

const io = new Server(3001, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

// Handle socket connections
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Check if userId is provided
  if (!userId) {
    console.error("No userId provided");
    socket.disconnect();
    return;
  }

  console.log(`User connected with ID: ${userId}`);

  // Handle document-related events
  socket.on("get-document", async (documentId) => {
    try {
      const document = await findOrCreateDocument(documentId, userId);
      socket.join(documentId);
      socket.emit("load-document", document?.data || {});

      // Broadcast changes to other connected clients
      socket.on("send-changes", (delta) => {
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });

      // Save document on client request
      socket.on("save-document", async (data) => {
        await Resume.findByIdAndUpdate(
          documentId,
          {
            data,
            chatHistory: document.chatHistory,
          },
          { upsert: true }
        );
      });
    } catch (error) {
      console.error("Error handling document events:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected with ID: ${userId}`);
  });
});

// Find or create document based on userId and documentId
async function findOrCreateDocument(documentId, userId) {
  try {
    let document = await Resume.findById(documentId);
    if (!document) {
      console.log("Document not found, creating a new one");
      document = new Resume({
        _id: documentId,
        userId,
        data: defaultValue,
      });
      await document.save();
    }
    return document;
  } catch (error) {
    console.error("Error finding or creating document:", error);
    throw error;
  }
}

// API to fetch resume by ID
app.get("/api/resume/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ error: "Content not found" });
    }
    res.json(resume);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Error fetching content" });
  }
});

// API to update resume
app.put("/api/resume/:id", ClerkExpressWithAuth(), async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.userId;
  const { content, chatMessage, name } = req.body;

  try {
    if (!id) {
      throw new Error("No resume ID provided");
    }

    let updateOperation = {};
    if (content) updateOperation.data = content;
    if (chatMessage && Array.isArray(chatMessage)) {
      updateOperation.$push = { chatHistory: { $each: chatMessage } };
    }

    const existingResume = await Resume.findById(id);

    if (!existingResume) {
      console.log("Resume not found, creating a new document");
      const newResume = new Resume({
        _id: id,
        userId,
        name: name || "Untitled",
        ...updateOperation,
      });
      await newResume.save();
      return res.json(newResume);
    }

    if (name && name !== existingResume.name) {
      updateOperation.name = name;
    }

    await Resume.updateOne({ _id: id }, updateOperation);

    const updatedResume = await Resume.findById(id);
    res.json(updatedResume);
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

app.delete("/api/resume/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedResume = await Resume.findByIdAndDelete(id);

    if (!deletedResume) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json({
      message: "Content deleted successfully",
      content: deletedResume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/resume", async (req, res) => {
  try {
    const userResumes = await Resume.find();
    res.status(200).send(userResumes);
  } catch (error) {
    console.error("Error fetching user chats:", err);
    res.status(500).send("Error fetching user chats!");
  }
});

// ImageKit Configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});

// Routes

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

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

app.get("/api/chat/:id", async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    if (!chat) {
      return res.status(404).send("Chat not found!");
    }

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
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      { $push: { history: { $each: newItems } } }
    );

    if (!updatedChat.matchedCount) {
      return res.status(404).send("Chat not found or not owned by user!");
    }

    res.status(200).send("Chat updated successfully!");
  } catch (err) {
    console.error("Error adding conversation:", err);
    res.status(500).send("Error adding conversation!");
  }
});

app.delete("/api/chat/:chatId", ClerkExpressWithAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.chatId;

  try {
    const userChat = await UserChat.findOne({ userId });

    if (!userChat) {
      return res.status(404).send("User chats not found!");
    }

    userChat.chats = userChat.chats.filter(
      (chat) => chat._id.toString() !== chatId
    );
    await userChat.save();

    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });

    if (!deletedChat) {
      return res
        .status(404)
        .send("Chat not found in the main chat collection!");
    }

    res.status(200).send("Chat deleted successfully!");
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).send("Error deleting chat!");
  }
});

// Start the Server
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on port ${port}`);
});
