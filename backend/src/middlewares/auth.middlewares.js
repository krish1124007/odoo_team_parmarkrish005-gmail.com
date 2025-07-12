import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("auth is",authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(
            new ApiResponse(401, "Unauthorized: Token missing or malformed", {
                success: false,
                data: "MissingOrMalformedToken"
            })
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRATE);

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json(
                new ApiResponse(401, "Unauthorized: User not found", {
                    success: false,
                    data: "UserNotFound"
                })
            );
        }

        req.user = user; // attach the user to request
        next();
    } catch (err) {
        console.error("JWT verify error:", err);
        return res.status(401).json(
            new ApiResponse(401, "Unauthorized: Invalid or expired token", {
                success: false,
                data: "InvalidOrExpiredToken"
            })
        );
    }
});
