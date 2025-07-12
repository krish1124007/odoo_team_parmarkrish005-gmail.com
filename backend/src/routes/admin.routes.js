import express from "express";
import {
  rejectContent,
  banUser,
  getSwaps,
  sendPlatformMessage,
  generateReport
} from "../controllers/admin/admin.controller.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Secure all routes with JWT and admin check
router.use(isAuthenticated, isAdmin);

// Content moderation
router.post("/reject-content", rejectContent);
router.post("/ban-user", banUser);

// Swap monitoring
router.get("/swaps", getSwaps);

// Platform messages
router.post("/send-message", sendPlatformMessage);

// Reports
router.post("/generate-report", generateReport);

export default router;