import express from "express";
import {
  sendMessage,
  getMessages,
  getChatConnections
} from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Secure all routes with JWT authentication
router.use(isAuthenticated);

// Send a message
router.post("/send", sendMessage);

// Get messages for a connection
router.get("/:connectionId", getMessages);

// Get all chat connections with recent messages
router.get("/", getChatConnections);

export default router;