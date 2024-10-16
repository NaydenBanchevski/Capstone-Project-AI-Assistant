import express from "express";
import mongoose from "mongoose";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import "dotenv/config";
import cors from "cors";
import { UserChat } from "./models/userChats.js";
import Chat from "./models/chat.js";

const port = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(ClerkExpressWithAuth());
app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

//  Create New Chat Route
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

// // // Fetch User Chats Route
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

// // Get a Specific Chat by ID Route
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

// // // Update a Chat by ID Route
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

app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on port ${port}`);
});
