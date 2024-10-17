import express from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import {
  getResume,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";

export const router = express.Router();

router.get("/:id", getResume);
router.put("/:id", ClerkExpressWithAuth(), updateResume);
router.delete("/:id", deleteResume);
