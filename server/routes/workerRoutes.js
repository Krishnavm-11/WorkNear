import express from "express";
import {
  createWorker,
  getWorkers,
  getWorker,
  getMyWorker,
  getAllWorkers,
  approveWorker,
  getFeaturedWorkers,
  updateWorker,
} from "../controllers/workerController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("profileImage"), createWorker);

router.get("/my-profile", protect, getMyWorker);

router.get("/all", getAllWorkers);

router.put("/approve/:id", approveWorker);

router.get("/featured", getFeaturedWorkers);

router.get("/", getWorkers);

router.get("/:id", getWorker);

router.put("/update",protect,upload.single("profileImage"),updateWorker);

export default router;