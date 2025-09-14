import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { sendsResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Register new User
export const registerUser = asyncHandler(async (req, res) => {
  // Taking JSON Input
  const { fullName, email, password } = req.body;

  // Validate Input
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json(sendsResponse(res, 400, false, "All fields are required"));
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json(sendsResponse(res, 409, false, "Email is already in use"));
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create a new User
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  // Send success response
  return res
    .status(201)
    .json(
      sendsResponse(
        res,
        201,
        true,
        "User registered succcessfully. Please login"
      )
    );
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  // Taking JSON Data
  const { email, password } = req.body;

  // validate input
  if (!email || !password) {
    return res
      .status(400)
      .json(sendsResponse(res, 400, false, "Email and password are required"));
  }

  // Find User already exists or not
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json(sendsResponse(res, 401, false, "Invalid credentials"));
  }

  // Compare Password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json(sendsResponse(res, 401, false, "Invalid credentials"));
  }

  // Check if active
  if (!user.isActive) {
    return res
      .status(403)
      .json(
        sendsResponse(res, 403, false, "Account is deactivated. Contact admin.")
      );
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken(user._id);

  // Stores user's token in DB 
  user.refreshTokens.push(refreshToken);
  await user.save();

  // return response
  return res.status(200).json(
    sendsResponse(res, 200, true, "Logged in successfully" ,{
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    })
  );
});

// Logout from Single device
export const logoutUser = asyncHandler(async (req, res) => {
  
  const { refreshToken } = req.body

  // chek if refrsh token is provided 
  if(!refreshToken){
    return res.status(400)
    .json(sendsResponse(res, 400, false, "Refresh token is required"));
  }

  // Find user with this refresh token 
  const user = await User.findOne({refreshTokens: refreshToken});

  if(!user){
    res.status(401)
    .json(sendsResponse(res, 401, false, "Invalid refresh token"));
  }

  // Remmove only this refresh token user's refresh tokens array
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== refreshToken
  );

  await user.save();

  return res
    .status(200)
    .json(sendsResponse(res, 200, true, "Logged out successfully"));
});

// Logout User form all devices
export const logoutAllDevices = asyncHandler(async (req, res) => {
  // Extract access token from headers 
  const authHeader = req.headers['authorization'];
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json(sendsResponse(res, 401, false, "Authorization token missing or invalid"));
  }

  const token = authHeader.split(" ")[1];

  // Verify token 
  let decoded;
  try {
     decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
     
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired access token" });
  }

 // Handle payload shape (either string or object)
  const userId = decoded.id?.id || decoded.id;

  // Find the user
  const user = await User.findById(userId);
  if(!user){
    return res.status(404).json({message:"User not found"});
  }

  // clear all refresh tokens 
  user.refreshTokens = [];
  await user.save();

  return res.status(200).json(sendsResponse(res, 200, true, "Logout from all devices successfully"))

}); 