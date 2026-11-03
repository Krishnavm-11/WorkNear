
import express from "express";

import {
  registerUser,
  verifyRegisterOtp,
  resendRegisterOtp,
  loginUser,
  adminLogin,
  getMyProfile,
  updateMyProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registration OTP
router.post("/register/send-otp", registerUser);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/register/resend-otp", resendRegisterOtp);

// Customer and worker login WITHOUT OTP
router.post("/login/password", loginUser);

// Admin login WITHOUT OTP
router.post("/login", adminLogin);

// Profile
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

export default router;
