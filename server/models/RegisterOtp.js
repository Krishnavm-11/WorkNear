
import mongoose from "mongoose";

const registerOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // The password is already hashed with bcrypt.
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "worker"],
      required: true,
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

    lastSentAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("RegisterOtp", registerOtpSchema);
