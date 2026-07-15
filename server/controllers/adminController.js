import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Booking from "../models/Booking.js";


export const getDashboard = async (req, res) => {
  try {

    const users = await User.countDocuments();
    const workers = await Worker.countDocuments();
    const bookings = await Booking.countDocuments();

    res.json({
      users,
      workers,
      bookings,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


export const getUsers = async (req, res) => {
  try {

    const users = await User.find({
      role: { $ne: "admin" }
    }).select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


export const getWorkers = async (req, res) => {
  try {

    const workers = await Worker.find();

    res.json(workers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


export const getBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("worker", "category location");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


export const approveWorker = async (req, res) => {
  try {

    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    worker.isApproved = true;

    await worker.save();

    res.json({
      message: "Worker Approved",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


export const rejectWorker = async (req, res) => {
  try {

    await Worker.findByIdAndDelete(req.params.id);

    res.json({
      message: "Worker Rejected",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const deleteUser = async (req, res) => {
  try {
    await Worker.deleteMany({ user: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);

    await Booking.deleteMany({ worker: req.params.id });

    res.json({
      message: "Worker deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};