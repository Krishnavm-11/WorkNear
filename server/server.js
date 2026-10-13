
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

const app = express();

// Allow your current frontend and local development
const allowedOrigins = [
  "http://localhost:5173",
  "https://work-near-iota.vercel.app",
  "https://work-near-3jw4.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// Middleware: CORS must run before API routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Connect MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);

// Backend health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "WorkNear API is running...",
  });
});

// Temporary authentication route test
app.get("/api/auth/test", (req, res) => {
  res.status(200).json({
    message: "Auth routes are working",
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      message: "This frontend origin is not allowed.",
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`WorkNear server running on port ${PORT}`);
});
