import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  category: {
    type: String,
  },

  skills: {
    type: String,
  },

  experience: {
    type: Number,
  },

  pricing: {
    type: Number,
  },

  location: {
    type: String,
  },

  description: {
    type: String,
  },

  profileImage: {
    type: String,
    default: "",
  },

  isApproved: {
    type: Boolean,
    default: false,
  },

});

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;