
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBriefcase,
  FaCheckCircle,
  FaExclamationCircle,
  FaTools,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import api from "../services/api";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const getWorker = async () => {
      try {
        const res = await api.get("/workers/" + id);
        setWorker(res.data);
      } catch (error) {
        console.error("Error fetching worker:", error);
        setMessage("Unable to load worker details. Please try again.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    getWorker();
  }, [id]);

  const bookWorker = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!date || !time) {
      setMessage(
        "Please select your preferred booking date and time."
      );
      setMessageType("error");
      return;
    }

    const selectedDate = new Date(`${date}T${time}`);

    if (selectedDate <= new Date()) {
      setMessage("Please select a future date and time.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/bookings", {
        worker: id,
        date,
        time,
        problem,
      });

      setMessage("Booking request submitted successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Booking error:", error);

      setMessage(
        error.response?.data?.message ||
          "Booking failed. Please check your details and try again."
      );

      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();

  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f6f2] px-5">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-5 text-sm font-medium text-neutral-500">
            Preparing your booking...
          </p>
        </div>
      </div>
    );
  }

  if (messageType === "error" && !worker._id && !worker.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f6f2] px-5">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <FaExclamationCircle className="mx-auto text-4xl text-orange-500" />

          <h2 className="mt-5 text-xl font-bold text-neutral-900">
            Unable to load professional
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            {message}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <FaArrowLeft />
            Go back
          </button>
        </div>
      </main>
    );
  }

  const workerName =
    worker.user?.name || worker.name || "Local Professional";

  const workerImage =
    worker.profileImage || worker.user?.profileImage;

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-6xl">

        {/* Back navigation */}
        <Link
          to={`/worker/${worker._id || id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-orange-600"
        >
          <FaArrowLeft />
          Back to professional
        </Link>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5 lg:gap-8">

          {/* Worker information */}
          <aside className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.035)] lg:col-span-2">
            <div className="h-1.5 bg-orange-500" />

            <div className="p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                Selected professional
              </p>

              <div className="mt-6 flex items-center gap-4">
                {workerImage ? (
                  <img
                    src={workerImage}
                    alt={workerName}
                    className="h-[76px] w-[76px] shrink-0 rounded-2xl object-cover ring-4 ring-[#f8f6f2]"
                  />
                ) : (
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl bg-[#f8f1e9] text-2xl text-orange-500 ring-4 ring-[#f8f6f2]">
                    <FaTools />
                  </div>
                )}

                <div className="min-w-0">
                  <Link
                    to={`/worker/${worker._id || id}`}
                    className="break-words text-lg font-bold text-neutral-900 transition hover:text-orange-600 sm:text-xl"
                  >
                    {workerName}
                  </Link>

                  <span className="mt-2 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {worker.category || "Service Professional"}
                  </span>

                  <Link
                    to={`/worker/${worker._id || id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 transition hover:text-orange-600"
                  >
                    View profile
                    <FaArrowRight />
                  </Link>
                </div>
              </div>

              <div className="my-7 border-t border-neutral-100" />

              <div className="space-y-5">

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-600">
                    <FaMapMarkerAlt />
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-medium text-neutral-500">
                      Service location
                    </p>

                    <p className="mt-1.5 break-words text-sm font-semibold text-neutral-800">
                      {worker.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <FaRupeeSign />
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-medium text-neutral-500">
                      Listed service price
                    </p>

                    <p className="mt-1 text-xl font-bold text-neutral-950">
                      {worker.pricing != null
                        ? `₹${worker.pricing}`
                        : "Contact for price"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Final pricing can be confirmed with the professional.
                    </p>
                  </div>
                </div>

                {/* Experience */}
                {worker.experience != null && (
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-600">
                      <FaBriefcase />
                    </div>

                    <div className="pt-0.5">
                      <p className="text-xs font-medium text-neutral-500">
                        Experience
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-neutral-800">
                        {worker.experience} years
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Information panel */}
              <div className="mt-8 rounded-xl border border-orange-100 bg-[#fffaf5] p-4">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="mt-0.5 shrink-0 text-orange-500" />

                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      Clear details, better service
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-neutral-600">
                      Share your requirements clearly to help the professional
                      prepare for the job.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Booking form */}
          <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.035)] lg:col-span-3">

            <div className="border-b border-neutral-100 px-6 py-6 sm:px-8 sm:py-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                Booking information
              </p>

              <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-neutral-950">
                Plan your service
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Select a suitable date and time, then describe the work you
                need done.
              </p>
            </div>

            <form onSubmit={bookWorker} className="space-y-6 p-6 sm:p-8">

              {/* Success and error messages */}
              {message && (
                <div
                  role={messageType === "error" ? "alert" : "status"}
                  aria-live="polite"
                  className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                    messageType === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {messageType === "success" ? (
                    <FaCheckCircle className="mt-1 shrink-0" />
                  ) : (
                    <FaExclamationCircle className="mt-1 shrink-0" />
                  )}

                  <p>{message}</p>
                </div>
              )}

              {/* Actions after successful booking */}
              {messageType === "success" && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/worker/${worker._id || id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-orange-300 hover:text-orange-600"
                  >
                    View worker profile
                    <FaArrowRight />
                  </Link>

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    My bookings
                    <FaArrowRight />
                  </button>
                </div>
              )}

              {/* Date and time */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="booking-date"
                    className="mb-2.5 block text-sm font-semibold text-neutral-800"
                  >
                    Booking date <span className="text-orange-500">*</span>
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400" />

                    <input
                      id="booking-date"
                      type="date"
                      min={minDate}
                      className="w-full rounded-xl border border-neutral-200 bg-[#fdfdfc] py-3.5 pl-11 pr-3 text-sm text-neutral-800 outline-none transition hover:border-neutral-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      disabled={messageType === "success"}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-time"
                    className="mb-2.5 block text-sm font-semibold text-neutral-800"
                  >
                    Preferred time <span className="text-orange-500">*</span>
                  </label>

                  <div className="relative">
                    <FaClock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400" />

                    <input
                      id="booking-time"
                      type="time"
                      className="w-full rounded-xl border border-neutral-200 bg-[#fdfdfc] py-3.5 pl-11 pr-3 text-sm text-neutral-800 outline-none transition hover:border-neutral-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      disabled={messageType === "success"}
                    />
                  </div>
                </div>
              </div>

              {/* Problem description */}
              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="booking-problem"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Describe your work
                  </label>

                  <span className="text-xs tabular-nums text-neutral-400">
                    {problem.length}/500
                  </span>
                </div>

                <textarea
                  id="booking-problem"
                  rows={5}
                  maxLength={500}
                  className="w-full resize-y rounded-xl border border-neutral-200 bg-[#fdfdfc] px-4 py-3.5 text-sm leading-6 text-neutral-800 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  placeholder="What needs to be fixed, installed, cleaned, or completed?"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  disabled={messageType === "success"}
                />

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Add any important details about the job or problem.
                </p>
              </div>

              {/* Submit button */}
              {messageType !== "success" && (
                <div className="border-t border-neutral-100 pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/15 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {submitting
                      ? "Submitting your request..."
                      : "Confirm booking"}

                    {!submitting && (
                      <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                    )}
                  </button>

                  <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
                    Please review your booking details before submitting.
                  </p>
                </div>
              )}
            </form>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-neutral-400">
          WorkNear <span className="mx-1.5">•</span> Connecting you with local
          professionals
        </p>
      </div>
    </main>
  );
}

export default Booking;
