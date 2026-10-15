import Booking from "../models/Booking.js";
import Worker from "../models/Worker.js";

export const createBooking = async (req, res) => {
  try {
    const { worker, date, time, problem } = req.body;

    if (!worker || !date || !time) {
      return res.status(400).json({
        message: "Worker, date and time are required",
      });
    }

    const workerProfile = await Worker.findById(worker);

    if (!workerProfile || !workerProfile.isApproved) {
      return res.status(404).json({
        message: "Approved worker not found",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      worker: workerProfile._id,
      date,
      time,
      problem: problem || "",
      status: "Pending",
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    // This endpoint does not expose customer phone or address.
    const bookings = await Booking.find()
      .select("worker date time problem status createdAt")
      .populate("worker", "category location profileImage")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBooking = async (req, res) => {
  return res.status(403).json({
    message: "Booking status can only be updated by the assigned worker",
  });
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select: "name phone",
        },
      })
      .sort({ createdAt: -1 });

    const safeBookings = bookings.map((booking) => {
      const item = booking.toObject();

      if (item.status !== "Accepted" && item.worker?.user) {
        item.worker.user.phone = "";
      }

      return item;
    });

    return res.json(safeBookings);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getWorkerBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      user: req.user._id,
    });

    if (!worker) {
      return res.status(404).json({
        message: "Worker profile not found",
      });
    }

    const bookings = await Booking.find({
      worker: worker._id,
    })
      .populate({
        path: "user",
        select: "name email phone address",
      })
      .populate("worker")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    if (req.user.role !== "worker") {
      return res.status(403).json({
        message: "Only workers can update booking status",
      });
    }

    const worker = await Worker.findOne({
      user: req.user._id,
    });

    if (!worker) {
      return res.status(403).json({
        message: "Worker profile not found",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      worker: worker._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found for this worker",
      });
    }

    if (
      ["Accepted", "Rejected"].includes(status) &&
      booking.status !== "Pending"
    ) {
      return res.status(400).json({
        message: "Only pending bookings can be accepted or rejected",
      });
    }

    if (
      status === "Completed" &&
      booking.status !== "Accepted"
    ) {
      return res.status(400).json({
        message: "Only accepted bookings can be completed",
      });
    }

    booking.status = status;

    await booking.save();

    return res.json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};