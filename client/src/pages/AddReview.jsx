import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function AddReview() {

  const { workerId, bookingId } = useParams();

  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async (e) => {

    e.preventDefault();

    try {

      await api.post("/reviews", {
        worker: workerId,
        booking: bookingId,
        rating,
        comment,
      });

      alert("Review Added Successfully");

      navigate("/worker/" + workerId);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Review Failed"
      );

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-8">

          Give Your Review

        </h1>

        <form onSubmit={submitReview}>

          <label className="font-semibold">

            Rating

          </label>

          <select
            className="w-full border rounded-lg p-3 mt-2 mb-6"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >

            <option value={5}>⭐⭐⭐⭐⭐</option>

            <option value={4}>⭐⭐⭐⭐</option>

            <option value={3}>⭐⭐⭐</option>

            <option value={2}>⭐⭐</option>

            <option value={1}>⭐</option>

          </select>

          <label className="font-semibold">

            Comment

          </label>

          <textarea
            rows="5"
            className="w-full border rounded-lg p-3 mt-2 mb-6"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 duration-300"
          >

            Submit Review

          </button>

        </form>

      </div>

    </div>

  );

}

export default AddReview;