
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTools,
  FaThLarge,
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaEdit,
  FaMapMarkerAlt,
  FaBriefcase,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaArrowRight,
  FaCamera,
  FaSyncAlt,
  FaPhone,
} from "react-icons/fa";
import api from "../services/api";

const initialForm = {
  category: "",
  skills: "",
  experience: "",
  pricing: "",
  location: "",
};

const navItems = [
  { id: "overview", label: "Overview", icon: FaThLarge },
  { id: "profile", label: "My Profile", icon: FaUser },
  { id: "bookings", label: "My Bookings", icon: FaCalendarAlt },
  { id: "contact", label: "Contact", icon: FaEnvelope },
];

function WorkerDashboard() {
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [formData, setFormData] = useState(initialForm);
  const [profileImage, setProfileImage] = useState(null);
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const getWorkerProfile = useCallback(async () => {
    try {
      const res = await api.get("/workers/my-profile");

      const data =
        res.data?.worker ||
        res.data?.profile ||
        res.data?.workerProfile ||
        res.data;

      if (!data?._id) {
        setWorker(null);
        setFormData(initialForm);
        return;
      }

      setWorker(data);

      setFormData({
        category: data.category || "",
        skills: Array.isArray(data.skills)
          ? data.skills.join(", ")
          : data.skills || "",
        experience: data.experience ?? "",
        pricing: data.pricing ?? "",
        location: data.location || "",
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setWorker(null);
        setFormData(initialForm);
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load your worker profile."
        );
      }
    }
  }, []);

  const getBookings = useCallback(async () => {
    try {
      const res = await api.get("/bookings/worker-bookings");
      const data = res.data?.bookings || res.data;

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setBookings([]);

      setError(
        err.response?.data?.message ||
          "Unable to load your bookings."
      );
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([getWorkerProfile(), getBookings()]);
    } finally {
      setLoading(false);
    }
  }, [getWorkerProfile, getBookings]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = new FormData();

      data.append("category", formData.category.trim());
      data.append("skills", formData.skills.trim());
      data.append("experience", formData.experience);
      data.append("pricing", formData.pricing);
      data.append("location", formData.location.trim());

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      if (worker) {
        await api.put("/workers/update", data);
        setMessage("Your profile has been updated successfully.");
      } else {
        await api.post("/workers", data);
        setMessage(
          "Your profile has been submitted for admin approval."
        );
      }

      setProfileImage(null);
      setEditing(false);

      await getWorkerProfile();
      setActiveTab("profile");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    setUpdatingBooking(bookingId);
    setError("");
    setMessage("");

    try {
      await api.put(`/bookings/${bookingId}`, { status });

      setMessage(
        `Booking ${status.toLowerCase()} successfully.`
      );

      await getBookings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update booking status."
      );
    } finally {
      setUpdatingBooking("");
    }
  };

  const openProfileForm = () => {
    setError("");
    setMessage("");
    setProfileImage(null);
    setEditing(true);
    setActiveTab("profile");
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setEditing(false);
    setMobileSidebarOpen(false);
    setError("");
    setMessage("");
  };

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  );

  const activeBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  );

  const approved = worker?.isApproved === true;

  let storedUser = {};

  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    storedUser = {};
  }

  const workerName =
    worker?.user?.name ||
    worker?.name ||
    storedUser.name ||
    "Worker";

  const statusStyle = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700",
      Accepted: "bg-blue-50 text-blue-700",
      Rejected: "bg-red-50 text-red-700",
      Completed: "bg-emerald-50 text-emerald-700",
      Approved: "bg-emerald-50 text-emerald-700",
    };

    return styles[status] || "bg-neutral-100 text-neutral-600";
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(
        status
      )}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2]">
        <div className="text-center">
          <FaSyncAlt className="mx-auto animate-spin text-3xl text-orange-500" />
          <p className="mt-4 text-sm text-neutral-500">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-neutral-900">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-5 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
            <FaTools />
          </span>

          <span className="text-lg font-extrabold tracking-tight">
            WorkNear<span className="text-orange-500">.</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="rounded-xl border border-neutral-200 p-2.5"
          aria-label="Toggle sidebar"
        >
          {mobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#171717] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-[86px] items-center gap-3 border-b border-white/10 px-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-lg">
              <FaTools />
            </span>

            <div>
              <p className="text-xl font-extrabold tracking-tight">
                WorkNear<span className="text-orange-500">.</span>
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                Worker workspace
              </p>
            </div>
          </div>

          <div className="mx-5 mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-500/15 text-lg text-orange-400">
                {worker?.profileImage ? (
                  <img
                    src={worker.profileImage}
                    alt={workerName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {workerName}
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  {worker?.category || "New worker"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  approved
                    ? "bg-emerald-400"
                    : worker
                    ? "bg-amber-400"
                    : "bg-neutral-500"
                }`}
              />

              <span className="text-neutral-300">
                {approved
                  ? "Profile approved"
                  : worker
                  ? "Approval pending"
                  : "Profile not created"}
              </span>
            </div>
          </div>

          <div className="px-7 pb-3 pt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            Workspace
          </div>

          <nav className="space-y-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition ${
                    active
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-950/20"
                      : "text-neutral-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{item.label}</span>

                  {item.id === "bookings" &&
                    pendingBookings.length > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-orange-600">
                        {pendingBookings.length}
                      </span>
                    )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="flex w-full items-center gap-3 px-8 py-5 text-left text-sm text-neutral-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 pb-12 pt-7 sm:px-7 lg:px-10 lg:pt-10 xl:px-12">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-7">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600">
                WORKER PORTAL /{" "}
                {navItems.find((item) => item.id === activeTab)?.label}
              </p>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {activeTab === "overview" && "Your workspace"}

                {activeTab === "profile" &&
                  (editing
                    ? worker
                      ? "Edit your profile"
                      : "Create your profile"
                    : "My profile")}

                {activeTab === "bookings" && "Manage your bookings"}

                {activeTab === "contact" && "Worker support"}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                {activeTab === "overview" &&
                  "Manage your professional profile and bookings in one place."}

                {activeTab === "profile" &&
                  "Keep your professional information accurate and up to date."}

                {activeTab === "bookings" &&
                  "View customer information and manage your booking requests."}

                {activeTab === "contact" &&
                  "Get assistance with your worker account and services."}
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold transition hover:border-orange-300"
            >
              <FaSyncAlt className="text-orange-500" />
              Refresh
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <FaTimesCircle className="mt-0.5 shrink-0" />
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="ml-auto"
                aria-label="Dismiss error"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              <FaCheckCircle className="mt-0.5 shrink-0" />
              <span>{message}</span>

              <button
                type="button"
                onClick={() => setMessage("")}
                className="ml-auto"
                aria-label="Dismiss message"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-7">
              {!worker && (
                <section className="relative overflow-hidden rounded-3xl bg-[#191919] p-6 text-white sm:p-9">
                  <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />

                  <div className="relative max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-300">
                      <FaTools /> Start your journey
                    </span>

                    <h2 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl">
                      Turn your skills into{" "}
                      <span className="text-orange-400">
                        opportunities.
                      </span>
                    </h2>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-400">
                      Create your professional profile so customers can find
                      your services after approval.
                    </p>

                    <button
                      type="button"
                      onClick={openProfileForm}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                      <FaPlus /> Create worker profile <FaArrowRight />
                    </button>
                  </div>
                </section>
              )}

              {worker && !approved && (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <FaHourglassHalf />
                    </div>

                    <div>
                      <h2 className="font-bold text-amber-900">
                        Your profile is awaiting approval
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-amber-800">
                        Your profile has been submitted. The admin must
                        approve it before it appears on the public workers
                        page.
                      </p>

                      <button
                        type="button"
                        onClick={() => changeTab("profile")}
                        className="mt-3 text-sm font-bold text-amber-900 underline underline-offset-4"
                      >
                        View profile details
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {worker && approved && (
                <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <FaCheckCircle />
                    </div>

                    <div>
                      <h2 className="font-bold text-emerald-900">
                        Your profile is approved
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        Your profile has been approved and can be listed for
                        customers according to your backend settings.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Total bookings",
                    value: bookings.length,
                    icon: FaCalendarAlt,
                    color: "bg-orange-50 text-orange-600",
                  },
                  {
                    label: "Pending requests",
                    value: pendingBookings.length,
                    icon: FaHourglassHalf,
                    color: "bg-amber-50 text-amber-700",
                  },
                  {
                    label: "Active bookings",
                    value: activeBookings.length,
                    icon: FaClock,
                    color: "bg-blue-50 text-blue-700",
                  },
                  {
                    label: "Completed jobs",
                    value: completedBookings.length,
                    icon: FaCheckCircle,
                    color: "bg-emerald-50 text-emerald-700",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-neutral-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                        >
                          <Icon />
                        </span>

                        <span className="text-2xl font-extrabold tabular-nums">
                          {stat.value}
                        </span>
                      </div>

                      <p className="mt-5 text-sm font-medium text-neutral-500">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </section>

              {worker && (
                <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                        Professional information
                      </p>

                      <h2 className="mt-2 text-xl font-extrabold">
                        Your worker profile
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={openProfileForm}
                      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold transition hover:border-orange-300 hover:text-orange-600"
                    >
                      <FaEdit /> Edit profile
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <FaBriefcase className="mt-1 text-orange-500" />
                      <div>
                        <p className="text-xs text-neutral-500">Category</p>
                        <p className="mt-1 font-semibold">
                          {worker.category || "Not added"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="mt-1 text-orange-500" />
                      <div>
                        <p className="text-xs text-neutral-500">Location</p>
                        <p className="mt-1 font-semibold">
                          {worker.location || "Not added"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaRupeeSign className="mt-1 text-orange-500" />
                      <div>
                        <p className="text-xs text-neutral-500">Price</p>
                        <p className="mt-1 font-semibold">
                          ₹{worker.pricing ?? "Not added"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-5 sm:px-7">
                  <div>
                    <h2 className="text-lg font-extrabold">
                      Recent bookings
                    </h2>

                    <p className="mt-1 text-xs text-neutral-500">
                      Keep track of your latest customer requests.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeTab("bookings")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
                  >
                    View all <FaArrowRight />
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <FaCalendarAlt className="mx-auto text-3xl text-neutral-300" />

                    <p className="mt-4 font-semibold">No bookings yet</p>

                    <p className="mt-1 text-sm text-neutral-500">
                      Customer booking requests will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {bookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7"
                      >
                        <div>
                          <p className="font-bold">
                            {booking.user?.name || "Customer"}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {booking.date} · {booking.time}
                          </p>
                        </div>

                        <StatusBadge status={booking.status} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
              <div className="border-b border-neutral-100 px-5 py-5 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold">
                      {editing
                        ? worker
                          ? "Update your details"
                          : "Create your worker profile"
                        : "Professional details"}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                      {worker
                        ? "Manage the information customers see about your services."
                        : "Complete your information and submit it for admin approval."}
                    </p>
                  </div>

                  {worker && !editing && (
                    <button
                      type="button"
                      onClick={openProfileForm}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                      <FaEdit /> Edit profile
                    </button>
                  )}
                </div>
              </div>

              {editing || !worker ? (
                <form
                  onSubmit={handleProfileSubmit}
                  className="space-y-6 p-5 sm:p-8"
                >
                  {!worker && (
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
                      Once you submit your profile, the admin will review
                      it before it appears publicly.
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="category"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Service category *
                      </label>

                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Select a category</option>

                        {[
                          "Electrician",
                          "Plumber",
                          "Carpenter",
                          "Cleaner",
                          "Tutor",
                          "Painter",
                          "Other",
                        ].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Service location *
                      </label>

                      <input
                        id="location"
                        name="location"
                        type="text"
                        required
                        maxLength={100}
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Alappuzha"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="skills"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Skills and services *
                      </label>

                      <textarea
                        id="skills"
                        name="skills"
                        required
                        rows={3}
                        maxLength={500}
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="Describe your skills and services"
                        className="w-full resize-y rounded-xl border border-neutral-200 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />

                      <p className="mt-1 text-right text-xs text-neutral-400">
                        {formData.skills.length}/500
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Experience (years) *
                      </label>

                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        max="80"
                        required
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g. 3"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pricing"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Price (₹) *
                      </label>

                      <input
                        id="pricing"
                        name="pricing"
                        type="number"
                        min="0"
                        required
                        value={formData.pricing}
                        onChange={handleInputChange}
                        placeholder="e.g. 500"
                        className="w-full rounded-xl border border-neutral-200 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="profileImage"
                        className="mb-2 block text-sm font-semibold"
                      >
                        Profile image {worker ? "(optional)" : "*"}
                      </label>

                      <label
                        htmlFor="profileImage"
                        className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-neutral-300 p-5 transition hover:border-orange-400 hover:bg-orange-50/50"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-500">
                          <FaCamera />
                        </span>

                        <span className="min-w-0">
                          <span className="block break-all text-sm font-semibold">
                            {profileImage
                              ? profileImage.name
                              : "Choose a profile image"}
                          </span>

                          <span className="mt-1 block text-xs text-neutral-500">
                            Select an image from your device.
                          </span>
                        </span>
                      </label>

                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        required={!worker}
                        onChange={(e) =>
                          setProfileImage(e.target.files?.[0] || null)
                        }
                        className="sr-only"
                      />

                      {worker?.profileImage && !profileImage && (
                        <p className="mt-2 text-xs text-neutral-500">
                          Your current profile image will be kept unless
                          you choose another one.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Saving..."
                        : worker
                        ? "Save changes"
                        : "Submit for approval"}

                      {!saving && <FaArrowRight />}
                    </button>

                    {worker && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setProfileImage(null);
                          setError("");

                          setFormData({
                            category: worker.category || "",
                            skills: Array.isArray(worker.skills)
                              ? worker.skills.join(", ")
                              : worker.skills || "",
                            experience: worker.experience ?? "",
                            pricing: worker.pricing ?? "",
                            location: worker.location || "",
                          });
                        }}
                        className="rounded-xl border border-neutral-200 px-6 py-3.5 text-sm font-semibold transition hover:bg-neutral-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="p-5 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
                      {worker.profileImage ? (
                        <img
                          src={worker.profileImage}
                          alt={workerName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-neutral-300">
                          <FaUser />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-extrabold">
                          {workerName}
                        </h3>

                        <StatusBadge
                          status={approved ? "Approved" : "Pending"}
                        />
                      </div>

                      <p className="mt-2 text-sm text-neutral-500">
                        {worker.category}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-neutral-500">
                            Location
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                            <FaMapMarkerAlt className="text-orange-500" />
                            {worker.location || "Not added"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-neutral-500">
                            Experience
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {worker.experience ?? 0} years
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-neutral-500">
                            Pricing
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                            <FaRupeeSign className="text-orange-500" />
                            {worker.pricing ?? "Not added"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-neutral-100 pt-6">
                    <h3 className="font-bold">Skills and services</h3>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-600">
                      {Array.isArray(worker.skills)
                        ? worker.skills.join(", ")
                        : worker.skills || "No skills added."}
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">
                    All booking requests
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Review customer details and manage each booking.
                  </p>
                </div>

                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-600 ring-1 ring-neutral-200">
                  {bookings.length} total
                </span>
              </div>

              {!worker ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center sm:p-12">
                  <FaUser className="mx-auto text-3xl text-neutral-300" />

                  <h3 className="mt-4 font-bold">
                    Create your worker profile first
                  </h3>

                  <p className="mt-2 text-sm text-neutral-500">
                    Your booking requests will appear here when customers
                    book your services.
                  </p>

                  <button
                    type="button"
                    onClick={openProfileForm}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                  >
                    Create profile
                  </button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center sm:p-14">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-500">
                    <FaCalendarAlt />
                  </span>

                  <h3 className="mt-5 font-extrabold">No bookings yet</h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                    Your customer requests will appear here. Accept,
                    reject, and complete bookings from this page.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {bookings.map((booking) => {
                    const customer = booking.user || {};
                    const customerAddress = customer.address || "";
                    const customerPhone = customer.phone || "";

                    return (
                      <article
                        key={booking._id}
                        className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 px-5 py-5 sm:px-7">
                          <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-500">
                              <FaUser />
                            </span>

                            <div>
                              <h3 className="font-extrabold">
                                {customer.name || "Customer"}
                              </h3>

                              <p className="mt-1 text-xs text-neutral-500">
                                Booking ID: {booking._id}
                              </p>
                            </div>
                          </div>

                          <StatusBadge status={booking.status} />
                        </div>

                        {/* Customer contact details */}
                        <div className="grid grid-cols-1 gap-5 border-b border-neutral-100 bg-orange-50/40 p-5 sm:grid-cols-2 sm:p-7">
                          <div>
                            <p className="text-xs font-medium text-neutral-500">
                              Customer email
                            </p>

                            <p className="mt-2 break-all text-sm font-semibold">
                              {customer.email || "Email not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-neutral-500">
                              Customer phone number
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                              <FaPhone className="shrink-0 text-orange-500" />

                              {customerPhone ? (
                                <a
                                  href={`tel:${customerPhone}`}
                                  className="break-all hover:text-orange-600"
                                >
                                  {customerPhone}
                                </a>
                              ) : (
                                "Phone number not provided"
                              )}
                            </p>
                          </div>

                          <div className="sm:col-span-2">
                            <p className="text-xs font-medium text-neutral-500">
                              Customer service address
                            </p>

                            <p className="mt-2 flex items-start gap-2 text-sm font-semibold leading-6">
                              <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-500" />

                              <span>
                                {customerAddress ||
                                  "Service address not provided"}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Booking information */}
                        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-3">
                          <div>
                            <p className="text-xs font-medium text-neutral-500">
                              Booking date
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                              <FaCalendarAlt className="text-orange-500" />
                              {booking.date || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-neutral-500">
                              Booking time
                            </p>

                            <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                              <FaClock className="text-orange-500" />
                              {booking.time || "Not specified"}
                            </p>
                          </div>

                          <div className="sm:col-span-2 xl:col-span-3">
                            <p className="text-xs font-medium text-neutral-500">
                              Customer's problem / service request
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                              {booking.problem ||
                                "No additional details provided."}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 sm:px-7">
                          <p className="text-xs text-neutral-500">
                            Update this booking when its status changes.
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {booking.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  disabled={updatingBooking === booking._id}
                                  onClick={() =>
                                    updateBookingStatus(
                                      booking._id,
                                      "Rejected"
                                    )
                                  }
                                  className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                  {updatingBooking === booking._id
                                    ? "Updating..."
                                    : "Reject"}
                                </button>

                                <button
                                  type="button"
                                  disabled={updatingBooking === booking._id}
                                  onClick={() =>
                                    updateBookingStatus(
                                      booking._id,
                                      "Accepted"
                                    )
                                  }
                                  className="rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                                >
                                  {updatingBooking === booking._id
                                    ? "Updating..."
                                    : "Accept booking"}
                                </button>
                              </>
                            )}

                            {booking.status === "Accepted" && (
                              <button
                                type="button"
                                disabled={updatingBooking === booking._id}
                                onClick={() =>
                                  updateBookingStatus(
                                    booking._id,
                                    "Completed"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                <FaCheckCircle />

                                {updatingBooking === booking._id
                                  ? "Updating..."
                                  : "Mark completed"}
                              </button>
                            )}

                            {(booking.status === "Rejected" ||
                              booking.status === "Completed") && (
                              <span className="py-2 text-xs font-medium text-neutral-500">
                                No further actions available
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* CONTACT */}
          {activeTab === "contact" && (
            <section className="grid grid-cols-1 gap-6">
              <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-[#191919] p-7 text-white sm:p-10 lg:p-12">
                <div className="absolute -right-12 -top-12 h-60 w-60 rounded-full bg-orange-500/15 blur-3xl" />

                <div className="relative max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-300">
                    <FaEnvelope className="text-orange-400" />
                    Worker support
                  </span>

                  <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
                    Need a hand?
                    <br />
                    <span className="text-orange-400">
                      We're here to help.
                    </span>
                  </h2>

                  <p className="mt-4 max-w-md text-sm leading-7 text-neutral-400">
                    Need help with your worker profile, account, approval
                    status, or bookings? Contact our support team for
                    assistance.
                  </p>

                  <Link
                    to="/worker-contact"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    Contact worker support <FaArrowRight />
                  </Link>
                </div>
              </div>
            </section>
          )}

          <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
            <p>
              © {new Date().getFullYear()} WorkNear. Worker workspace.
            </p>

            <p className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-500" />
              Manage your work in one place
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default WorkerDashboard;
