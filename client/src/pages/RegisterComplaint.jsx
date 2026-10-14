import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaCheckCircle,
  FaPaperPlane,
  FaShieldAlt,
} from "react-icons/fa";
import api from "../services/api";

function RegisterComplaint() {
  const { workerId, bookingId } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submitComplaint = async (e) => {
    e.preventDefault();

    setMessage("");
    setSubmitting(true);

    try {
      await api.post("/complaints", {
        worker: workerId,
        booking: bookingId,
        complaint,
      });

      setSuccess(true);
      setMessage("Your complaint has been submitted successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message || "Unable to submit your complaint. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-orange-300 hover:text-orange-600"
        >
          <FaArrowLeft className="text-xs" />
          Go back
        </button>

        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="h-1.5 bg-orange-500" />

          <div className="p-6 sm:p-9">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-600">
                <FaExclamationCircle />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                  Register a complaint
                </h1>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Tell us what happened so we can review your concern.
                </p>
              </div>
            </div>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                  success
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {success ? (
                  <FaCheckCircle className="mt-1 shrink-0" />
                ) : (
                  <FaExclamationCircle className="mt-1 shrink-0" />
                )}
                <p>{message}</p>
              </div>
            )}

            <form onSubmit={submitComplaint}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="complaint"
                  className="text-sm font-semibold text-neutral-800"
                >
                  Complaint details
                </label>

                <span className="text-xs tabular-nums text-neutral-400">
                  {complaint.length}/1000
                </span>
              </div>

              <textarea
                id="complaint"
                rows={7}
                maxLength={1000}
                className="w-full resize-y rounded-xl border border-neutral-200 bg-[#fdfdfc] px-4 py-4 text-sm leading-7 text-neutral-800 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                placeholder="Describe your concern and include any important details..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
                minLength={10}
              />

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Please provide enough detail to help us understand your concern.
              </p>

              <div className="mt-7 flex items-start gap-3 rounded-xl border border-neutral-100 bg-[#f8f6f2] p-4">
                <FaShieldAlt className="mt-0.5 shrink-0 text-orange-500" />
                <p className="text-xs leading-5 text-neutral-600">
                  Your complaint will be submitted for review. Please ensure
                  the information you provide is accurate.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || success}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/15 transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting complaint..." : "Submit complaint"}
                {!submitting && <FaPaperPlane />}
              </button>
            </form>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-neutral-400">
          WorkNear <span className="mx-1.5">•</span> Here to help resolve your concern
        </p>
      </div>
    </main>
  );
}

export default RegisterComplaint;