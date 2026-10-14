import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaArrowRight,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../services/api";

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setStatus({
      type: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/contact",
          message: "Please log in to send us a message.",
        },
      });

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/contact", formData);

      setStatus({
        type: "success",
        message:
          response.data?.message ||
          "Your message has been sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to send your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: FaMapMarkerAlt,
      title: "Our location",
      value: "Bengaluru, Karnataka, India",
      description: "Connecting local communities",
    },
    {
      icon: FaPhoneAlt,
      title: "Call us",
      value: "+91 9876543210",
      description: "For assistance and enquiries",
      href: "tel:+919876543210",
    },
    {
      icon: FaEnvelope,
      title: "Email us",
      value: "worknear.platform@gmail.com",
      description: "Send us your questions",
      href: "mailto:support@worknear.com",
    },
    {
      icon: FaClock,
      title: "Working hours",
      value: "Monday – Saturday",
      description: "9:00 AM – 7:00 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#171717]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10 sm:h-[450px] sm:w-[450px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
          {/* LEFT SIDE — HEADING */}
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">
                Get in touch
              </p>
            </div>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Let's start a
              <br />
              <span className="text-orange-500">conversation.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
              Have a question, suggestion, or need help with WorkNear?
              We'd love to hear from you.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm text-white/50">
              <FaEnvelope className="text-orange-500" />
              <span>We're here to help you connect.</span>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -right-3 -top-3 h-24 w-24 border-r-2 border-t-2 border-orange-500 sm:-right-5 sm:-top-5" />

            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop&q=85"
                alt="Professionals working together and communicating"
                className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION AND FORM */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          {/* SECTION HEADING */}
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              Contact WorkNear
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              We'd love to hear
              <span className="text-orange-600"> from you.</span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-neutral-500">
              Whether you need assistance or have feedback to share, reach
              out to our team. We're happy to help.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            {/* LEFT SIDE — CONTACT DETAILS */}
            <div>
              <h3 className="mb-8 text-xl font-semibold">
                Contact information
              </h3>

              <div className="space-y-7">
                {contactDetails.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="flex gap-5 border-b border-neutral-200 pb-7 last:border-b-0"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white text-orange-600 shadow-sm">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold">
                          {item.title}
                        </h4>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-2 block break-words text-sm font-medium transition hover:text-orange-600"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-2 text-sm font-medium">
                            {item.value}
                          </p>
                        )}

                        <p className="mt-1 text-sm leading-6 text-neutral-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SMALL NOTE */}
              <div className="mt-8 border-l-2 border-orange-500 bg-white p-5">
                <p className="text-sm font-semibold">
                  We're here to make things easier.
                </p>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Your questions and suggestions help us improve the
                  WorkNear experience.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE — CONTACT FORM */}
            <div className="border border-neutral-200 bg-white p-6 sm:p-9 lg:p-10">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                  Send a message
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  How can we help?
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Fill in the details below and we'll get back to you.
                </p>
              </div>

              {/* STATUS MESSAGE */}
              {status.message && (
                <div
                  role="status"
                  className={`mb-6 flex items-start gap-3 border p-4 text-sm leading-6 ${
                    status.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {status.type === "success" && (
                    <FaCheckCircle className="mt-1 shrink-0" />
                  )}

                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NAME AND EMAIL */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Full name <span className="text-orange-600">*</span>
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      maxLength={100}
                      required
                      className="w-full border border-neutral-200 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email address{" "}
                      <span className="text-orange-600">*</span>
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={254}
                      required
                      className="w-full border border-neutral-200 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* SUBJECT */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium"
                  >
                    Subject <span className="text-orange-600">*</span>
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your message about?"
                    maxLength={150}
                    required
                    className="w-full border border-neutral-200 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium"
                  >
                    Your message{" "}
                    <span className="text-orange-600">*</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={6}
                    maxLength={3000}
                    required
                    className="w-full resize-y border border-neutral-200 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />

                  <p className="mt-2 text-right text-xs text-neutral-400">
                    {formData.message.length}/3000 characters
                  </p>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Sending message..." : "Send message"}

                  {!loading && (
                    <FaPaperPlane className="transition-transform group-hover:translate-x-1" />
                  )}
                </button>

                <p className="text-xs leading-5 text-neutral-400">
                  Fields marked with * are required. You must be logged in
                  to submit this form.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#111111] px-5 py-14 text-white sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
              WorkNear community
            </p>

            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Let's make local work easier.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
              Discover skilled professionals and connect with people in
              your community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/workers")}
            className="group flex shrink-0 items-center justify-center gap-3 self-start bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600 sm:self-auto"
          >
            Find a worker
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;