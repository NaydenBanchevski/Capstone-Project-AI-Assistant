import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  _id: String,
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
    default: "Untitled",
  },
  data: Object,
  chatHistory: [
    {
      sender: String,
      message: String,
      timestamp: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Resume = mongoose.model("Resume", ResumeSchema);
