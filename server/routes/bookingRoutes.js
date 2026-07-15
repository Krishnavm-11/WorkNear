import express from "express";

import {
  createBooking,
  getBookings,
  getMyBookings,
  getWorkerBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.get("/worker-bookings", protect, getWorkerBookings);

router.get("/", getBookings);

router.put("/:id", protect, updateBookingStatus);

export default router;