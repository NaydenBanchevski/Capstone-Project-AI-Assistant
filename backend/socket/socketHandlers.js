import { Resume } from "../models/resumeSchema.js";
import { Server } from "socket.io";

const defaultValue = "";

export const socketHandler = (io) => {
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
        socket.emit("load-document", document?.data || {});

        socket.on("send-changes", (delta) => {
          socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

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

    socket.on("disconnect", () => {
      console.log(`User disconnected with ID: ${userId}`);
    });
  });
};

// Helper function to find or create a document
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
