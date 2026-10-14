
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTools,
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaClipboardList,
  FaArrowRight,
  FaStar,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";

import api from "../services/api";

function UserProfile() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch the customer's bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my-bookings");

      const bookingData = Array.isArray(response.data)
        ? response.data
        : response.data.bookings || [];

      setBookings(bookingData);
    } catch (err) {
      console.error("Failed to load bookings:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Booking statistics
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed"
  ).length;

  // Filter bookings by status
  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter(
          (booking) =>
            booking.status?.toLowerCase() ===
            activeFilter.toLowerCase()
        );

  // Status badge styles
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100";

      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-100";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Sidebar link component
  const SidebarLink = ({
    to,
    icon: Icon,
    children,
    active = false,
  }) => (
    <Link
      to={to}
      onClick={closeSidebar}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-orange-500 text-white shadow-lg shadow-orange-950/20"
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="text-base" />

      <span>{children}</span>

      {active && (
        <FaArrowRight className="ml-auto text-xs" />
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#171717] px-5 py-6 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3 px-2">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-xl">
              <FaTools />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Work<span className="text-orange-500">Near</span>
              </h1>

              <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Customer space
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={closeSidebar}
            className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
          >
            <FaTimes />
          </button>
        </div>

        {/* Sidebar menu */}
        <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Workspace
        </p>

        <nav className="space-y-2">
          <SidebarLink
            to="/profile"
            icon={FaHome}
            active
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            to="/profile"
            icon={FaCalendarAlt}
          >
            My Bookings
          </SidebarLink>

          <SidebarLink
            to="/profile"
            icon={FaBookmark}
          >
            Saved Workers
          </SidebarLink>

          <SidebarLink
            to="/profile"
            icon={FaUser}
          >
            My Profile
          </SidebarLink>
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* Main dashboard */}
      <main className="min-h-screen lg:ml-72">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10">

          {/* Mobile dashboard heading */}
          <div className="mb-7 flex items-center gap-4">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-gray-200 bg-white p-3 text-gray-700 lg:hidden"
            >
              <FaBars />
            </button>

            <div>
              <p className="text-xs text-gray-500">
                Customer workspace
              </p>

              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                My Dashboard
              </h2>
            </div>
          </div>

          {/* Welcome banner */}
          <section className="relative overflow-hidden rounded-3xl bg-[#202020] p-6 text-white sm:p-9 lg:p-10">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[35px] border-orange-500/10" />

            <div className="pointer-events-none absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-gray-300">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                YOUR PERSONAL WORKSPACE
              </div>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Welcome back,
                <br />

                <span className="text-orange-400">
                  {user.name?.split(" ")[0] || "there"}.
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-gray-400 sm:text-base">
                Manage your service bookings and keep track
                of your local service requests in one place.
              </p>
            </div>
          </section>

          {/* Booking statistics */}
          <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {/* Total bookings */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Bookings
                  </p>

                  <h3 className="mt-3 text-3xl font-extrabold">
                    {totalBookings}
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    All your service requests
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-lg text-orange-600">
                  <FaClipboardList />
                </div>
              </div>
            </div>

            {/* Pending bookings */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pending Bookings
                  </p>

                  <h3 className="mt-3 text-3xl font-extrabold">
                    {pendingBookings}
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    Waiting for an update
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-lg text-amber-600">
                  <FaClock />
                </div>
              </div>
            </div>

            {/* Completed bookings */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:col-span-2 sm:p-6 xl:col-span-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Completed Jobs
                  </p>

                  <h3 className="mt-3 text-3xl font-extrabold">
                    {completedBookings}
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    Services completed
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-600">
                  <FaCheckCircle />
                </div>
              </div>
            </div>
          </section>

          {/* Account overview / Your Profile */}
          <section className="mt-7">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-700">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Account overview
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold">
                    Your Profile
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your personal account information.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-[#f7f6f2] p-4">
                  <p className="text-xs text-gray-500">
                    Full Name
                  </p>

                  <p className="mt-2 break-words font-semibold">
                    {user.name || "Customer"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f6f2] p-4">
                  <p className="text-xs text-gray-500">
                    Email Address
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold">
                    {user.email || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f6f2] p-4 sm:col-span-2">
                  <p className="text-xs text-gray-500">
                    Account Type
                  </p>

                  <p className="mt-2 font-semibold capitalize">
                    {user.role || "Customer"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Existing bookings */}
          <section className="mt-8" id="my-bookings">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold sm:text-2xl">
                  Booking Details
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  View the status of your service requests.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchBookings}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
              >
                <FaSyncAlt
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            {/* Booking filters */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {[
                "All",
                "Pending",
                "Accepted",
                "Completed",
                "Cancelled",
              ].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-[#202020] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {filter}

                  {filter === "All" && (
                    <span className="ml-2 text-xs opacity-70">
                      {totalBookings}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

                <p className="mt-4 text-sm text-gray-500">
                  Loading your bookings...
                </p>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                  <FaExclamationCircle className="mt-1 text-red-500" />

                  <div>
                    <p className="font-semibold text-red-800">
                      Could not load bookings
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={fetchBookings}
                      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading &&
              !error &&
              filteredBookings.length === 0 && (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-500">
                    <FaCalendarAlt />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {bookings.length === 0
                      ? "No bookings yet"
                      : "No bookings in this category"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    {bookings.length === 0
                      ? "Your service bookings will appear here when you book a professional."
                      : "Try selecting another status to see your bookings."}
                  </p>
                </div>
              )}

            {/* Booking cards */}
            {!loading &&
              !error &&
              filteredBookings.length > 0 && (
                <div className="mt-5 grid grid-cols-1 gap-4 2xl:grid-cols-2">
                  {filteredBookings.map((booking) => {
                    const worker = booking.worker;
                    const status = booking.status || "Pending";

                    return (
                      <article
                        key={booking._id}
                        className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:p-6"
                      >
                        {/* Worker and status */}
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-lg text-orange-600">
                              <FaTools />
                            </div>

                            <div className="min-w-0">
                              <h3 className="break-words font-bold">
                                {worker?.name ||
                                  "Service Professional"}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500">
                                {worker?.category ||
                                  "Local service"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Booking information */}
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <FaCalendarAlt className="mt-0.5 shrink-0 text-orange-500" />

                            <div>
                              <p className="text-xs text-gray-400">
                                Booking Date
                              </p>

                              <p className="mt-1 font-medium">
                                {booking.date
                                  ? new Date(
                                      booking.date
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <FaClock className="mt-0.5 shrink-0 text-orange-500" />

                            <div>
                              <p className="text-xs text-gray-400">
                                Preferred Time
                              </p>

                              <p className="mt-1 font-medium">
                                {booking.time || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Problem details */}
                        {booking.problem && (
                          <div className="mt-4 rounded-xl bg-[#f7f6f2] p-4">
                            <p className="text-xs font-semibold text-gray-500">
                              Service Details
                            </p>

                            <p className="mt-1 break-words text-sm leading-6 text-gray-700">
                              {booking.problem}
                            </p>
                          </div>
                        )}

                        {/* Existing booking actions */}
                        <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                          {status.toLowerCase() === "completed" &&
                            worker?._id && (
                              <Link
                                to={`/review/${worker._id}/${booking._id}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
                              >
                                <FaStar />
                                Write a Review
                              </Link>
                            )}

                          {worker?._id && (
                            <Link
                              to={`/register-complaint/${worker._id}/${booking._id}`}
                              className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              Report an Issue
                            </Link>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
          </section>

          {/* Footer */}
          <footer className="mt-10 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
            WorkNear Customer Dashboard
          </footer>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;
