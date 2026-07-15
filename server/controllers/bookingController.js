import Booking from "../models/Booking.js";
import Worker from "../models/Worker.js";

export const createBooking = async (req, res) => {
  try {
    const { worker, date, time, problem } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      worker,
      date,
      time,
      problem,
    });

    res.status(201).json(booking);

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
      .populate({
        path: "worker",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = req.body.status;

    await booking.save();

    res.json({
      message: "Booking updated",
      booking: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {

  try {

    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("worker")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
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
      .populate("user", "name email")
      .populate("worker");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const updateBookingStatus = async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {

      return res.status(404).json({
        message: "Booking not found",
      });

    }

    booking.status = req.body.status;

    await booking.save();

    res.json({
      message: "Status Updated",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};