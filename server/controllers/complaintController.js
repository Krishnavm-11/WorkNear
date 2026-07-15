import Complaint from "../models/Complaint.js";

export const addComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.create({
      user: req.user._id,
      worker: req.body.worker,
      complaint: req.body.complaint,
    });

    res.status(201).json(complaint);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("worker", "category");

    res.json(complaints);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const resolveComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status = "Resolved";

    await complaint.save();

    res.json({
      message: "Complaint Resolved",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};