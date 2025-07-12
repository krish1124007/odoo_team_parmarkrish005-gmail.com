import mongoose from "mongoose";

const adminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  actionType: {
    type: String,
    enum: ["content_rejection", "user_ban", "platform_message", "report_generation"],
    required: true
  },
  targetId: mongoose.Schema.Types.ObjectId, // User/Swap/Content ID
  reason: String,
  details: mongoose.Schema.Types.Mixed,
  resolved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const platformMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  audience: {
    type: String,
    enum: ["all", "active", "inactive"],
    default: "all"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  }
}, { timestamps: true });

export const AdminAction = mongoose.model("AdminAction", adminActionSchema);
export const PlatformMessage = mongoose.model("PlatformMessage", platformMessageSchema);