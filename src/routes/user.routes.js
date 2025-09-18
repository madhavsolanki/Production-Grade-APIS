import express from "express";
import { deactivateMyAccount, deleteUserByAdmin, getCurrentUserProfile, reactivateUserByAdmin, updateUserProfile } from "../controllers/user.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUserProfile)

router.patch("/me", authMiddleware, updateUserProfile);

router.delete("/me", authMiddleware, deactivateMyAccount);

// Admin Can deactivate the account
router.delete("/:id", authMiddleware, requireRole(["ADMIN"]), deleteUserByAdmin);

router.patch("/:id/reactivate", authMiddleware, requireRole(["ADMIN"]), reactivateUserByAdmin);

export default router;