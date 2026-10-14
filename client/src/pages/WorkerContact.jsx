import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import api from "../services/api";

function WorkerContact() {
  const [hasProfile, setHasProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);

  // Check whether the worker has created a profile
  useEffect(() => {
    const checkWorkerProfile = async () => {
      try {
        const res = await api.get("/workers/my-profile");
        const data = res.data;

        // Support common API response structures
        const profile =
          data?.worker ||
          data?.profile ||
          data?.workerProfile ||
          data;

        const profileExists =
          Boolean(profile?._id || profile?.id) &&
          !data?.message?.toLowerCase?.().includes("not found");

        setHasProfile(profileExists);

        if (profileExists) {
          setFormData((prev) => ({
            ...prev,
            name: profile.name || profile.user?.name || "",
            email: profile.email || profile.user?.email || "",
          }));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false);
        } else {
          setHasProfile(false);
          setFeedback(
            "Unable to check your worker profile. Please try again."
          );
        }
      } finally {
        setCheckingProfile(false);
      }
    };

    checkWorkerProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasProfile) {
      setFeedback("Please create your worker profile first.");
      return;
    }

    try {
      setLoading(true);
      setFeedback("");
      setSuccess(false);

      await api.post("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(true);
      setFeedback("Your message has been sent successfully.");

      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (error) {
      setFeedback(
        error.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading screen while checking the profile
  if (checkingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f2ed]">
        <p className="text-sm font-medium text-gray-600">
          Checking your worker profile...
        </p>
      </div>
    );
  }

  // Show this if the worker has not created a profile
  if (!hasProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f2ed] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg shadow-black/5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Create Your Worker Profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            You need to create your worker profile before you can contact
            WorkNear support.
          </p>

          {feedback && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {feedback}
            </p>
          )}

          <Link
            to="/create-worker-profile"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Create Worker Profile
          </Link>

          <div>
            <Link
              to="/worker-dashboard"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600"
            >
              <FaArrowLeft />
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Contact form is displayed only after a profile is found
  return (
    <main className="min-h-screen bg-[#f4f2ed] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Link
          to="/worker-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-orange-600"
        >
          <FaArrowLeft />
          Back to dashboard
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 sm:p-9">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Contact <span className="text-orange-500">Us</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Have a question or need help? Send us a message.
          </p>

          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-5 rounded-xl border p-3.5 text-sm ${
                success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="worker-contact-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Name
              </label>

              <input
                id="worker-contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="worker-contact-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>

              <input
                id="worker-contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="worker-contact-subject"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Subject
              </label>

              <input
                id="worker-contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter the subject"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="worker-contact-message"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Message
              </label>

              <textarea
                id="worker-contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={5}
                required
                className="w-full resize-y rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaPaperPlane />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default WorkerContact;