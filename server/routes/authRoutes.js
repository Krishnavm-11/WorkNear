
import express from "express";

import {
  registerUser,
  verifyRegisterOtp,
  resendRegisterOtp,
  loginUser,
  verifyLoginOtp,
  adminLogin,
} from "../controllers/authController.js";

const router = express.Router();

// Registration OTP
router.post("/register/send-otp", registerUser);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/register/resend-otp", resendRegisterOtp);

// Customer and worker login with OTP
router.post("/login/send-otp", loginUser);
router.post("/verify-otp", verifyLoginOtp);

// Admin login without OTP
router.post("/login", adminLogin);

export default router;
