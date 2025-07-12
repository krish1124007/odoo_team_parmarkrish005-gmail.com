
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (!user || !user.isAdmin) {
     new ApiResponse(403, "Forbidden: Admin access required",{success:false});
  }

  next();
});