import express from "express";
import {
  addComplaint,
  getComplaints,
  resolveComplaint,
} from "../controllers/complaintController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Customer
router.post("/", protect, addComplaint);

// Admin
router.get("/", protect, admin, getComplaints);
router.put("/:id", protect, admin, resolveComplaint);

export default router;