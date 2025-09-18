import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendsResponse } from "../utils/response.js";
import { verifyToken } from "../utils/jwt.js";


// Protect Route By Verifyig JWT
export const authMiddleware = asyncHandler(async (req, res, next) => {
 const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(sendsResponse(401, false, "Authorization token missing or invalid"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // attach to request
    next();
  } catch (error) {
    return res
      .status(403)
      .json(sendsResponse(403, false, "Invalid or expired access token"));
  }
});


// Role Base Access Control (RBAC)
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if(!req.user){
      return res
        .status(401)
        .json(sendsResponse(401, false, "Unauthorized, please login first"));
    }

    if(!roles.includes(req.user.role)){
      return res
        .status(403)
         .json(sendsResponse(401, false, "Access denied, insufficient permissions"));
    }
    next();
  };
};