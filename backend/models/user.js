import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true }, // Add the email field
});

export const User = mongoose.model("User", userSchema);
