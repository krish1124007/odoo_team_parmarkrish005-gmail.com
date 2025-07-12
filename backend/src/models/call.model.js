import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SwapRequest",
    required: true
  },
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  callType: {
    type: String,
    enum: ["video", "voice"],
    required: true
  },
  status: {
    type: String,
    enum: ["initiated", "ongoing", "completed", "missed", "rejected"],
    default: "initiated"
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  duration: {
    type: Number // in seconds
  },
  // WebRTC related fields
  callerSignal: {
    type: String
  },
  receiverSignal: {
    type: String
  },
  roomId: {
    type: String,
    unique: true
  }
}, { timestamps: true });

export const Call = mongoose.model("Call", callSchema);