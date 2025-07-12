import { User } from "../../models/user.models.js";
import { SwapRequest } from "../../models/swap.model.js";
import { AdminAction, PlatformMessage } from "../../models/admin.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import mongoose from "mongoose";

// Reject inappropriate content
const rejectContent = asyncHandler(async (req, res) => {
  const { contentId, contentType, reason } = req.body;
  const adminId = req.user._id;

  if (!contentId || !contentType || !reason) {
    return res.status(400).json(
      new ApiResponse(400, "Content ID, type, and reason are required", {
        success: false,
        data: "MissingFieldsError"
      })
    );
  }

  // Create admin action record
  const action = await AdminAction.create({
    adminId,
    actionType: "content_rejection",
    targetId: contentId,
    reason,
    details: { contentType }
  });

  // TODO: Notify user about content rejection

  return res.status(200).json(
    new ApiResponse(200, "Content rejected successfully", {
      success: true,
      data: action
    })
  );
});

// Ban a user
const banUser = asyncHandler(async (req, res) => {
  const { userId, reason, durationDays } = req.body;
  const adminId = req.user._id;

  if (!userId || !reason) {
    return res.status(400).json(
      new ApiResponse(400, "User ID and reason are required", {
        success: false,
        data: "MissingFieldsError"
      })
    );
  }

  // Find and update user
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { 
        isBanned: true,
        banReason: reason,
        banExpiresAt: durationDays ? 
          new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : 
          null
      }
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, "User not found", {
        success: false,
        data: "NotFoundError"
      })
    );
  }

  // Create admin action record
  const action = await AdminAction.create({
    adminId,
    actionType: "user_ban",
    targetId: userId,
    reason,
    details: { durationDays }
  });

  // TODO: Notify user about ban

  return res.status(200).json(
    new ApiResponse(200, "User banned successfully", {
      success: true,
      data: { user, action }
    })
  );
});

// Get all swaps with filtering
const getSwaps = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: [
      { path: "sender", select: "username profile_photo" },
      { path: "receiver", select: "username profile_photo" }
    ]
  };

  const swaps = await SwapRequest.paginate(filter, options);

  return res.status(200).json(
    new ApiResponse(200, "Swaps retrieved successfully", {
      success: true,
      data: swaps
    })
  );
});

// Send platform-wide message
const sendPlatformMessage = asyncHandler(async (req, res) => {
  const { message, audience, priority } = req.body;
  const senderId = req.user._id;

  if (!message) {
    return res.status(400).json(
      new ApiResponse(400, "Message is required", {
        success: false,
        data: "MissingFieldsError"
      })
    );
  }

  const platformMessage = await PlatformMessage.create({
    sender: senderId,
    message,
    audience: audience || "all",
    priority: priority || "medium"
  });

  // TODO: Implement actual notification system
  // This could be email, in-app notifications, etc.

  return res.status(201).json(
    new ApiResponse(201, "Platform message sent successfully", {
      success: true,
      data: platformMessage
    })
  );
});

// Generate reports
const generateReport = asyncHandler(async (req, res) => {
  const { reportType, startDate, endDate } = req.body;

  if (!reportType) {
    return res.status(400).json(
      new ApiResponse(400, "Report type is required", {
        success: false,
        data: "MissingFieldsError"
      })
    );
  }

  let reportData;
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  switch (reportType) {
    case "user_activity":
      reportData = await User.aggregate([
        { $match: dateFilter },
        { $project: { 
          username: 1, 
          email: 1, 
          lastActive: 1, 
          swapCount: { $size: "$swapHistory" } 
        }}
      ]);
      break;

    case "swap_stats":
      reportData = await SwapRequest.aggregate([
        { $match: dateFilter },
        { $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgDuration: { $avg: "$duration" }
        }}
      ]);
      break;

    case "feedback":
      reportData = await Feedback.aggregate([
        { $match: dateFilter },
        { $group: {
          _id: "$rating",
          count: { $sum: 1 },
          comments: { $push: "$comment" }
        }}
      ]);
      break;

    default:
      return res.status(400).json(
        new ApiResponse(400, "Invalid report type", {
          success: false,
          data: "InvalidInputError"
        })
      );
  }

  // Create admin action record
  await AdminAction.create({
    adminId: req.user._id,
    actionType: "report_generation",
    details: {
      reportType,
      startDate,
      endDate,
      recordCount: reportData.length
    }
  });

  return res.status(200).json(
    new ApiResponse(200, "Report generated successfully", {
      success: true,
      data: reportData
    })
  );
});

export {
  rejectContent,
  banUser,
  getSwaps,
  sendPlatformMessage,
  generateReport
};