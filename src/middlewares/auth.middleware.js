import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorResponse } from "../utils/response.js";

// Protect Route By Verifyig JWT
export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json(errorResponse("No token provided, authorization denied"));
  }

  try {
    // Verify Token 
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach Payload (id, role, etc) to request object
    req.user = decoded;

    next();

  } catch (error) {
    return res
      .status(401)
      .json(errorResponse("Invalid or expired token, please login again"));
  }
});


// Role Base Access Control (RBAC)
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if(!req.user){
      return res
        .status(401)
        .json(errorResponse("Unauthorized, please login first"));
    }

    if(!roles.includes(req.user.role)){
      return res
        .status(403)
         .json(errorResponse("Access denied, insufficient permissions"));
    }
    next();
  };
};