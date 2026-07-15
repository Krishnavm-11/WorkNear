import express from "express";

import {
  getDashboard,
  getUsers,
  getWorkers,
  getBookings,
  approveWorker,
  rejectWorker,
  deleteUser,
deleteWorker,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getDashboard);

router.get("/users", protect, admin, getUsers);

router.get("/workers", protect, admin, getWorkers);

router.get("/bookings", protect, admin, getBookings);

router.put("/approve/:id", protect, admin, approveWorker);

router.delete("/reject/:id", protect, admin, rejectWorker);

router.delete("/user/:id", protect, admin, deleteUser);

router.delete("/worker/:id", protect, admin, deleteWorker);

export default router;