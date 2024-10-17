import express from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { createChat, getChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", ClerkExpressWithAuth(), createChat);
router.get("/:id", ClerkExpressWithAuth(), getChat);

export default router;
