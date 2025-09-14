import jwt from "jsonwebtoken";

// Generate Acccess token
export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: process.env.JWT_ACCESS_EXPIRE  } 
  );
};

// Generate Refresh Token 
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: process.env.JWT_REFRESH_EXPIRE  } 
  );
};


// Verify any token 
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};