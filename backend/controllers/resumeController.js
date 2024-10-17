import { Resume } from "../models/resumeSchema.js";

export const getResume = async (req, res) => {
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
};

export const updateResume = async (req, res) => {
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
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

export const deleteResume = async (req, res) => {
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
};
