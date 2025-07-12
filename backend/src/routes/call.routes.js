import express from "express";
import {
  initiateCall,
  endCall,
  getCallHistory,
  handleSignaling
} from "../controllers/call.controller.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Secure all routes with JWT authentication
router.use(isAuthenticated);

// Initiate a new call
router.post("/initiate", initiateCall);

// End a call
router.put("/end/:callId", endCall);

// Get call history for a connection
router.get("/history/:connectionId", getCallHistory);

// WebRTC signaling endpoint
router.post("/signal", handleSignaling);

export default router;