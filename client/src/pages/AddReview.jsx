
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaStar,
  FaArrowLeft,
  FaPaperPlane,
  FaQuoteLeft,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../services/api";

function AddReview() {
  const { workerId, bookingId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!comment.trim()) {
      setError("Please write a comment about your experience.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/reviews", {
        worker: workerId,
        booking: bookingId,
        rating,
        comment: comment.trim(),
      });

      setMessage("Your review has been submitted successfully!");

      setTimeout(() => {
        navigate(`/worker/${workerId}`);
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't submit your review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          to={`/worker/${workerId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-500"
        >
          <FaArrowLeft />
          Back to professional
        </Link>

        <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/60 md:grid-cols-[0.85fr_1.15fr]">
          {/* Left introduction panel */}
          <div className="relative overflow-hidden bg-[#171717] p-8 text-white sm:p-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                Your feedback matters
              </span>

              <FaQuoteLeft className="mt-12 text-4xl text-orange-400" />

              <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
                How was your
                <span className="block text-orange-400">
                  experience?
                </span>
              </h1>

              <p className="mt-5 leading-7 text-gray-300">
                Your honest feedback helps other customers make informed
                decisions and helps local professionals improve their service.
              </p>

              <div className="mt-10 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                    <FaStar />
                  </div>

                  <div>
                    <p className="font-semibold">Share your experience</p>
                    <p className="mt-1 text-sm text-gray-400">
                      Rate honestly and add a comment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review form */}
          <div className="p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
              Customer review
            </p>

            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              Give your review
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Tell us how the service went.
            </p>

            {message && (
              <div
                role="status"
                className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <FaCheckCircle className="mt-0.5 shrink-0" />
                {message}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={submitReview} className="mt-7 space-y-7">
              {/* Interactive rating */}
              <div>
                <label className="block text-sm font-bold text-gray-800">
                  Your rating
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  How would you rate this service?
                </p>

                <div
                  className="mt-4 flex flex-wrap items-center gap-2"
                  role="group"
                  aria-label="Choose a rating"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`${star} star${star === 1 ? "" : "s"}`}
                      aria-pressed={rating === star}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                        star <= rating
                          ? "border-amber-300 bg-amber-50 text-amber-400"
                          : "border-gray-200 bg-white text-gray-300 hover:border-amber-200"
                      }`}
                    >
                      <FaStar className="text-xl" />
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  {rating === 5 && "Excellent"}
                  {rating === 4 && "Very good"}
                  {rating === 3 && "Good"}
                  {rating === 2 && "Could be better"}
                  {rating === 1 && "Poor"}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-sm font-bold text-gray-800"
                >
                  Your comments
                </label>

                <textarea
                  id="review-comment"
                  rows={5}
                  maxLength={1000}
                  className="mt-3 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  placeholder="Share what went well or what could be improved..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />

                <p className="mt-2 text-right text-xs text-gray-400">
                  {comment.length}/1000 characters
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || Boolean(message)}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Submitting review..."
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit review
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                Please keep your review honest, respectful and relevant to
                your service experience.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddReview;
