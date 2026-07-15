import Worker from "../models/Worker.js";
import Review from "../models/Review.js";

// Create worker profile
export const createWorker = async (req, res) => {
  try {
    const workerExists = await Worker.findOne({
      user: req.user._id,
    });

    if (workerExists) {
      return res.status(400).json({
        message: "Worker profile already exists",
      });
    }

    const worker = await Worker.create({
      user: req.user._id,
      category: req.body.category,
      skills: req.body.skills,
      experience: req.body.experience,
      pricing: req.body.pricing,
      location: req.body.location,
      description: req.body.description,
      profileImage: req.file ? req.file.path : "",
      isApproved: false,
    });

    res.status(201).json({
      message: "Worker Profile Created Successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Logged in worker profile
export const getMyWorker = async (req, res) => {
  try {
    const worker = await Worker.findOne({
      user: req.user._id,
    }).populate("user", "name email");

    if (!worker) {
      return res.status(404).json({
        message: "Worker Profile Not Found",
      });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateWorker = async (req, res) => {
  try {

    const worker = await Worker.findOne({
      user: req.user._id,
    });

    if (!worker) {
      return res.status(404).json({
        message: "Worker profile not found",
      });
    }

    worker.category = req.body.category;
    worker.skills = req.body.skills;
    worker.experience = req.body.experience;
    worker.pricing = req.body.pricing;
    worker.location = req.body.location;

    if (req.file) {
      worker.profileImage = req.file.path;
    }

    await worker.save();

    res.json({
      message: "Profile Updated Successfully",
      worker,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Show approved workers only
export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({
      isApproved: true,
    }).populate("user", "name email");

    res.json(workers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Featured workers - most reviewed
export const getFeaturedWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({
      isApproved: true,
    }).populate("user", "name email");

    const featuredWorkers = [];

    for (let worker of workers) {
      const reviews = await Review.find({
        worker: worker._id,
      });

      featuredWorkers.push({
        ...worker._doc,
        totalReviews: reviews.length,
      });
    }

    featuredWorkers.sort((a, b) => {
      return b.totalReviews - a.totalReviews;
    });

    res.json(featuredWorkers.slice(0, 3));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin - get all workers
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate("user", "name email");

    res.json(workers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get single worker
export const getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate("user", "name email");

    if (!worker) {
      return res.status(404).json({
        message: "Worker Not Found",
      });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin - approve worker
export const approveWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        message: "Worker Not Found",
      });
    }

    worker.isApproved = true;

    await worker.save();

    res.json({
      message: "Worker Approved Successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};