import express from "express";
import {
  loginUser,
  logoutAllDevices,
  logoutUser,
  refreshAccesstToken,
  registerUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/logout/all", logoutAllDevices);
router.post("/refresh", refreshAccesstToken);

export default router;
