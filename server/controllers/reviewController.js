import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {

    const reviewExists = await Review.findOne({
      booking: req.body.booking,
    });

    if (reviewExists) {

      return res.status(400).json({
        message: "You have already reviewed this booking",
      });

    }

    const review = await Review.create({
      user: req.user._id,
      worker: req.body.worker,
      booking: req.body.booking,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(201).json({
      message: "Review Added Successfully",
      review,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const getWorkerReviews = async (req, res) => {

  try {

    const reviews = await Review.find({
      worker: req.params.id,
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};