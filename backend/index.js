import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { User } from "./models/user.js";
import "dotenv/config";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { socketHandler } from "./socket/socketHandlers.js";
import { resumeRoutes } from "./routes/resumeRoutes.js";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

const port = process.env.PORT || 3000;
const app = express();
app.use(ClerkExpressWithAuth());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

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

const io = new Server(3001, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

app.use(express.json());

app.use("/api/resume", resumeRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on port ${port}`);
});
