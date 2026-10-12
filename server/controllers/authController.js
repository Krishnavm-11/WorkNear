
import User from "../models/User.js";
import LoginOtp from "../models/LoginOtp.js";
import RegisterOtp from "../models/RegisterOtp.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import sendOtpEmail from "../utils/sendOtpEmail.js";

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

const normalizeEmail = (email) => email.trim().toLowerCase();

const findUserByEmail = (email) =>
  User.findOne({ email: normalizeEmail(email) });

const generateOtp = () =>
  crypto.randomInt(100000, 1000000).toString();

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const compareOtp = (otp, savedHash) => {
  const submittedHash = Buffer.from(hashOtp(otp), "hex");
  const expectedHash = Buffer.from(savedHash, "hex");

  return (
    submittedHash.length === expectedHash.length &&
    crypto.timingSafeEqual(submittedHash, expectedHash)
  );
};

const otpExpiry = () =>
  new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const resendWait = (record) => {
  const elapsed = Date.now() - new Date(record.lastSentAt).getTime();

  return Math.max(
    0,
    Math.ceil((OTP_RESEND_SECONDS * 1000 - elapsed) / 1000)
  );
};

// Send registration OTP.
// POST /api/auth/register/send-otp
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({
        message: "Name must be between 2 and 80 characters.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const selectedRole = role || "user";

    if (!["user", "worker"].includes(selectedRole)) {
      return res.status(400).json({
        message: "Invalid registration role.",
      });
    }

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const existingOtp = await RegisterOtp.findOne({
      email: normalizedEmail,
    });

    if (existingOtp) {
      const wait = resendWait(existingOtp);

      if (wait > 0) {
        return res.status(429).json({
          message: "Please wait before requesting another OTP.",
          retryAfter: wait,
        });
      }
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    // Save temporary registration details, not a User account.
    await RegisterOtp.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        name: name.trim(),
        password: hashedPassword,
        role: selectedRole,
        otpHash: hashOtp(otp),
        expiresAt: otpExpiry(),
        attempts: 0,
        lastSentAt: now,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    try {
      // Do not return success until the mail server accepts the email.
      await sendOtpEmail(normalizedEmail, otp, "register");
    } catch (emailError) {
      console.error("Registration email error:", emailError.message);

      // Remove the pending record so the user can retry immediately.
      await RegisterOtp.deleteOne({ email: normalizedEmail });

      return res.status(502).json({
        message:
          "We could not send your verification email. Please check the email settings and try again.",
      });
    }

    console.log("Registration OTP accepted by email server:", normalizedEmail);

    return res.status(200).json({
      message: "Verification code sent. It expires in 5 minutes.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration OTP error:", error);

    return res.status(500).json({
      message: "Unable to start registration. Please try again.",
    });
  }
};

// Verify registration OTP and create the account.
// POST /api/auth/register/verify-otp
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        message: "Enter your email and a valid 6-digit OTP.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const pending = await RegisterOtp.findOne({
      email: normalizedEmail,
    });

    if (!pending) {
      return res.status(400).json({
        message: "Registration request not found. Please register again.",
      });
    }

    if (new Date(pending.expiresAt).getTime() <= Date.now()) {
      await RegisterOtp.deleteOne({ _id: pending._id });

      return res.status(400).json({
        message: "OTP expired. Please register again.",
      });
    }

    if (pending.attempts >= MAX_OTP_ATTEMPTS) {
      await RegisterOtp.deleteOne({ _id: pending._id });

      return res.status(429).json({
        message: "Too many incorrect attempts. Please register again.",
      });
    }

    if (!compareOtp(otp, pending.otpHash)) {
      pending.attempts += 1;

      if (pending.attempts >= MAX_OTP_ATTEMPTS) {
        await RegisterOtp.deleteOne({ _id: pending._id });

        return res.status(429).json({
          message: "Too many incorrect attempts. Please register again.",
        });
      }

      await pending.save();

      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
        attemptsRemaining: MAX_OTP_ATTEMPTS - pending.attempts,
      });
    }

    // Check again before creating the account.
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      await RegisterOtp.deleteOne({ _id: pending._id });

      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
      });
    }

    // The actual user is created only after OTP verification.
    const user = await User.create({
      name: pending.name,
      email: normalizedEmail,
      password: pending.password,
      role: pending.role,
    });

    await RegisterOtp.deleteOne({ _id: pending._id });

    return res.status(201).json({
      message: "Registration successful! Your email has been verified.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration verification error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
      });
    }

    return res.status(500).json({
      message: "OTP verification failed. Please try again.",
    });
  }
};

// Resend registration OTP.
// POST /api/auth/register/resend-otp
export const resendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        message: "Email address is required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const pending = await RegisterOtp.findOne({
      email: normalizedEmail,
    });

    if (!pending) {
      return res.status(400).json({
        message: "Registration request not found. Please register again.",
      });
    }

    const wait = resendWait(pending);

    if (wait > 0) {
      return res.status(429).json({
        message: "Please wait before requesting another OTP.",
        retryAfter: wait,
      });
    }

    if (await findUserByEmail(normalizedEmail)) {
      await RegisterOtp.deleteOne({ _id: pending._id });

      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
      });
    }

    const otp = generateOtp();

    pending.otpHash = hashOtp(otp);
    pending.expiresAt = otpExpiry();
    pending.attempts = 0;
    pending.lastSentAt = new Date();

    await pending.save();

    try {
      await sendOtpEmail(normalizedEmail, otp, "register");
    } catch (emailError) {
      console.error("Registration resend email error:", emailError.message);
      await RegisterOtp.deleteOne({ _id: pending._id });

      return res.status(502).json({
        message: "Could not send the verification email. Please register again.",
      });
    }

    return res.status(200).json({
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    console.error("Resend registration OTP error:", error);

    return res.status(500).json({
      message: "Unable to resend the verification code.",
    });
  }
};

// Check password and send login OTP.
// POST /api/auth/login/send-otp
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await findUserByEmail(normalizedEmail);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Please use Admin Login.",
      });
    }

    if (!["user", "worker"].includes(user.role)) {
      return res.status(403).json({
        message: "This account cannot log in here.",
      });
    }

    const existingOtp = await LoginOtp.findOne({
      email: normalizedEmail,
    });

    if (existingOtp) {
      const wait = resendWait(existingOtp);

      if (wait > 0) {
        return res.status(429).json({
          message: "Please wait before requesting another OTP.",
          retryAfter: wait,
        });
      }
    }

    const otp = generateOtp();

    await LoginOtp.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        otpHash: hashOtp(otp),
        expiresAt: otpExpiry(),
        attempts: 0,
        lastSentAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    try {
      await sendOtpEmail(normalizedEmail, otp, "login");
    } catch (emailError) {
      console.error("Login OTP email error:", emailError.message);
      await LoginOtp.deleteOne({ email: normalizedEmail });

      return res.status(502).json({
        message: "Could not send the login OTP email. Please try again.",
      });
    }

    return res.status(200).json({
      message: "Login OTP sent. It expires in 5 minutes.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Login OTP error:", error);

    return res.status(500).json({
      message: "Unable to start login. Please try again.",
    });
  }
};

// Verify login OTP and issue JWT.
// POST /api/auth/verify-otp
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        message: "Enter your email and a valid 6-digit OTP.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const record = await LoginOtp.findOne({
      email: normalizedEmail,
    });

    if (!record) {
      return res.status(400).json({
        message: "OTP not found. Please log in again.",
      });
    }

    if (new Date(record.expiresAt).getTime() <= Date.now()) {
      await LoginOtp.deleteOne({ _id: record._id });

      return res.status(400).json({
        message: "OTP expired. Please log in again.",
      });
    }

    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await LoginOtp.deleteOne({ _id: record._id });

      return res.status(429).json({
        message: "Too many incorrect attempts. Please log in again.",
      });
    }

    if (!compareOtp(otp, record.otpHash)) {
      record.attempts += 1;

      if (record.attempts >= MAX_OTP_ATTEMPTS) {
        await LoginOtp.deleteOne({ _id: record._id });

        return res.status(429).json({
          message: "Too many incorrect attempts. Please log in again.",
        });
      }

      await record.save();

      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
        attemptsRemaining: MAX_OTP_ATTEMPTS - record.attempts,
      });
    }

    const user = await findUserByEmail(normalizedEmail);

    if (!user || !["user", "worker"].includes(user.role)) {
      await LoginOtp.deleteOne({ _id: record._id });

      return res.status(401).json({
        message: "Account is no longer available for this login.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await LoginOtp.deleteOne({ _id: record._id });

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login OTP verification error:", error);

    return res.status(500).json({
      message: "OTP verification failed. Please try again.",
    });
  }
};
