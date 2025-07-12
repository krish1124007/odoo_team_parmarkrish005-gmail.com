import { Call } from "../models/call.model.js";
import { SwapRequest } from "../models/swap.model.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { generateRoomId } from "../utils/generateRoomId.js";

// Initiate a call
const initiateCall = asyncHandler(async (req, res) => {
  const { connectionId, callType } = req.body;
  const callerId = req.user._id;

  // Validate input
  if (!connectionId || !callType) {
    return res.status(400).json(
      new ApiResponse(400, "Connection ID and call type are required", {
        success: false,
        data: "MissingFieldsError"
      })
    );
  }

  // Check if connection exists
  const connection = await SwapRequest.findOne({
    _id: connectionId,
    status: "accepted",
    $or: [
      { sender: callerId },
      { receiver: callerId }
    ]
  });

  if (!connection) {
    return res.status(404).json(
      new ApiResponse(404, "Connection not found or not accepted", {
        success: false,
        data: "NotFoundError"
      })
    );
  }

  // Determine who is the receiver
  const receiverId = connection.sender.equals(callerId) 
    ? connection.receiver 
    : connection.sender;

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json(
      new ApiResponse(404, "Receiver not found", {
        success: false,
        data: "NotFoundError"
      })
    );
  }

  // Create a new call record
  const roomId = generateRoomId();
  const newCall = await Call.create({
    connectionId,
    caller: callerId,
    receiver: receiverId,
    callType,
    roomId,
    status: "initiated"
  });

  // Prepare response data
  const responseData = {
    callId: newCall._id,
    roomId: newCall.roomId,
    callType: newCall.callType,
    receiver: {
      _id: receiver._id,
      username: receiver.username,
      profile_photo: receiver.profile_photo
    }
  };

  return res.status(201).json(
    new ApiResponse(201, "Call initiated successfully", {
      success: true,
      data: responseData
    })
  );
});

// End a call
const endCall = asyncHandler(async (req, res) => {
  const { callId } = req.params;
  const userId = req.user._id;

  // Find the call
  const call = await Call.findOne({
    _id: callId,
    $or: [
      { caller: userId },
      { receiver: userId }
    ]
  });

  if (!call) {
    return res.status(404).json(
      new ApiResponse(404, "Call not found", {
        success: false,
        data: "NotFoundError"
      })
    );
  }

  // Update call status and duration
  call.status = "completed";
  call.endedAt = new Date();
  call.duration = Math.floor((call.endedAt - call.startedAt) / 1000); // in seconds

  await call.save();

  return res.status(200).json(
    new ApiResponse(200, "Call ended successfully", {
      success: true,
      data: {
        callId: call._id,
        duration: call.duration
      }
    })
  );
});

// Get call history for a connection
const getCallHistory = asyncHandler(async (req, res) => {
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
      new ApiResponse(403, "Not authorized to view this call history", {
        success: false,
        data: "AuthorizationError"
      })
    );
  }

  // Get all calls for this connection
  const calls = await Call.find({ connectionId })
    .sort({ createdAt: -1 })
    .populate("caller", "username profile_photo")
    .populate("receiver", "username profile_photo");

  return res.status(200).json(
    new ApiResponse(200, "Call history retrieved successfully", {
      success: true,
      data: calls
    })
  );
});

// WebRTC signaling - Exchange SDP offers/answers
const handleSignaling = asyncHandler(async (req, res) => {
  const { callId, signal } = req.body;
  const userId = req.user._id;

  // Find the call
  const call = await Call.findById(callId);
  if (!call) {
    return res.status(404).json(
      new ApiResponse(404, "Call not found", {
        success: false,
        data: "NotFoundError"
      })
    );
  }

  // Determine if user is caller or receiver
  if (call.caller.equals(userId)) {
    call.callerSignal = signal;
  } else if (call.receiver.equals(userId)) {
    call.receiverSignal = signal;
  } else {
    return res.status(403).json(
      new ApiResponse(403, "Not authorized to participate in this call", {
        success: false,
        data: "AuthorizationError"
      })
    );
  }

  await call.save();

  return res.status(200).json(
    new ApiResponse(200, "Signal processed successfully", {
      success: true,
      data: {
        callId: call._id,
        status: call.status
      }
    })
  );
});

export {
  initiateCall,
  endCall,
  getCallHistory,
  handleSignaling
};