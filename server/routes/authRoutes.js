import express from "express";

import {
  registerUser,
  verifyRegisterOtp,
  resendRegisterOtp,
  loginUser,
  verifyLoginOtp,
  adminLogin,
  getMyProfile,
  updateMyProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register/send-otp", registerUser);

router.post("/register/verify-otp", verifyRegisterOtp);

router.post("/register/resend-otp", resendRegisterOtp);

router.post("/login/send-otp", loginUser);

router.post("/verify-otp", verifyLoginOtp);

router.post("/login", adminLogin);

router.get("/profile", protect, getMyProfile);

router.put("/profile", protect, updateMyProfile);

export default router;