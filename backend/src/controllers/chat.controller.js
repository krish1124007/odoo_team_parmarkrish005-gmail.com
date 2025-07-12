import { ChatMessage } from "../models/chat.model.js";
import { SwapRequest } from "../models/swap.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { connectionId, message } = req.body;
  const senderId = req.user._id;

  if (!connectionId || !message) {
    return res.status(400).json(
      new ApiResponse(400, "Connection ID and message are required", {
        success: false,
        data: "MissingFieldsError"
      })
    );
  }

  // Verify the connection exists and is accepted
  const connection = await SwapRequest.findOne({
    _id: connectionId,
    status: "accepted",
    $or: [
      { sender: senderId },
      { receiver: senderId }
    ]
  });

  if (!connection) {
    return res.status(403).json(
      new ApiResponse(403, "Not authorized to send messages in this connection", {
        success: false,
        data: "AuthorizationError"
      })
    );
  }

  // Create and save the message
  const newMessage = await ChatMessage.create({
    connectionId,
    sender: senderId,
    message
  });

  return res.status(201).json(
    new ApiResponse(201, "Message sent successfully", {
      success: true,
      data: {
        _id: newMessage._id,
        connectionId: newMessage.connectionId,
        sender: senderId,
        message: newMessage.message,
        createdAt: newMessage.createdAt
      }
    })
  );
});

// Get all messages for a connection
const getMessages = asyncHandler(async (req, res) => {
  const { connectionId } = req.params;
  const userId = req.user._id;

  // Verify the user is part of this connection
  const connection = await SwapRequest.findOne({
    _id: connectionId,
    status: "accepted",
    $or: [
      { sender: userId },
      { receiver: userId }
    ]
  });

  if (!connection) {
    return res.status(403).json(
      new ApiResponse(403, "Not authorized to view these messages", {
        success: false,
        data: "AuthorizationError"
      })
    );
  }

  // Get all messages for this connection
  const messages = await ChatMessage.find({ connectionId })
    .sort({ createdAt: 1 })
    .populate("sender", "username profile_photo");

  // Mark messages as read if they're sent to the current user
  await ChatMessage.updateMany(
    {
      connectionId,
      sender: { $ne: userId },
      read: false
    },
    { $set: { read: true } }
  );

  return res.status(200).json(
    new ApiResponse(200, "Messages retrieved successfully", {
      success: true,
      data: messages
    })
  );
});

// Get all connections with recent messages
const getChatConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all accepted connections
  const connections = await SwapRequest.find({
    status: "accepted",
    $or: [
      { sender: userId },
      { receiver: userId }
    ]
  })
    .populate("sender", "username profile_photo")
    .populate("receiver", "username profile_photo");

  // Get last message and unread count for each connection
  const connectionsWithMessages = await Promise.all(
    connections.map(async (connection) => {
      const otherUser = connection.sender._id.equals(userId) 
        ? connection.receiver 
        : connection.sender;

      const lastMessage = await ChatMessage.findOne({ connectionId: connection._id })
        .sort({ createdAt: -1 })
        .select("message createdAt read sender");

      const unreadCount = await ChatMessage.countDocuments({
        connectionId: connection._id,
        sender: otherUser._id,
        read: false
      });

      return {
        connectionId: connection._id,
        user: otherUser,
        lastMessage: lastMessage ? {
          message: lastMessage.message,
          createdAt: lastMessage.createdAt,
          isMine: lastMessage.sender.equals(userId)
        } : null,
        unreadCount
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, "Chat connections retrieved successfully", {
      success: true,
      data: connectionsWithMessages
    })
  );
});

export {
  sendMessage,
  getMessages,
  getChatConnections
};