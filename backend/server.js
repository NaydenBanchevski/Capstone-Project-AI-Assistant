import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on port ${port}`);
});
