
import mongoose from "mongoose";

const authOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    purpose: {
      type: String,
      required: true,
      enum: ["register", "login"],
    },

    // Registration details are kept temporarily until verification.
    name: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "worker", "admin"],
      default: "user",
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One separate OTP record per email and purpose.
authOtpSchema.index(
  { email: 1, purpose: 1 },
  { unique: true }
);

// Automatically clean up expired OTP records.
authOtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("AuthOtp", authOtpSchema);
