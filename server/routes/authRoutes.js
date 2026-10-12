
import express from "express";

import {
  registerUser,
  verifyRegisterOtp,
  resendRegisterOtp,
  loginUser,
  verifyLoginOtp,
} from "../controllers/authController.js";

const router = express.Router();

// Registration OTP
router.post("/register/send-otp", registerUser);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/register/resend-otp", resendRegisterOtp);

// Login OTP
router.post("/login/send-otp", loginUser);
router.post("/verify-otp", verifyLoginOtp);

export default router;
