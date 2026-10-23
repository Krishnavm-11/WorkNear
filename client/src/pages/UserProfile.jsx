
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaHeart,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTools,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaSearch,
  FaStar,
  FaExclamationCircle,
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimesCircle,
} from "react-icons/fa";
import api from "../services/api";

const UserProfile = () => {
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  // Hide the application-level Navbar and Footer while the dashboard is open.
  // Restore their previous display values when leaving the dashboard.
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("body nav, body header, body footer")
    );

    const hiddenElements = elements.filter((element) => {
      // Do not hide the dashboard's own sidebar or its controls.
      return !element.closest("aside") &&
        !element.closest("main");
    });

    const previousStyles = hiddenElements.map((element) => ({
      element,
      display: element.style.display,
    }));

    hiddenElements.forEach((element) => {
      element.style.display = "none";
    });

    return () => {
      previousStyles.forEach(({ element, display }) => {
        element.style.display = display;
      });
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my-bookings");

      const bookingData = Array.isArray(response.data)
        ? response.data
        : response.data?.bookings || [];

      setBookings(bookingData);
    } catch (err) {
      console.error("Error fetching bookings:", err);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await api.get("/auth/profile");
        const savedUser = response.data?.user;

        if (!savedUser) {
          throw new Error("Profile details were not returned.");
        }

        setProfile({
          name: savedUser.name || "",
          phone: savedUser.phone || "",
          email: savedUser.email || "",
          address: savedUser.address || "",
        });

        const localUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({ ...localUser, ...savedUser })
        );
      } catch (err) {
        console.error("Error fetching profile:", err);

        const localUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        setProfile({
          name: localUser.name || "",
          phone: localUser.phone || "",
          email: localUser.email || "",
          address: localUser.address || "",
        });

        setProfileError(
          err.response?.data?.message ||
            "Unable to load the latest profile. You can retry below."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.slice(1);

    const timer = setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash, loading, profileLoading]);

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter((booking) =>
    ["pending", "accepted"].includes(booking.status?.toLowerCase())
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed"
  ).length;

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter =
      activeFilter === "All" ||
      booking.status?.toLowerCase() === activeFilter.toLowerCase();

    const workerName =
      booking.worker?.user?.name ||
      booking.worker?.name ||
      "";

    const category =
      booking.worker?.category ||
      booking.worker?.skill ||
      "";

    const problem = booking.problem || "";

    const matchesSearch = `${workerName} ${category} ${problem}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    setSavingProfile(true);
    setProfileError("");
    setProfileMessage("");

    try {
      const response = await api.put("/auth/profile", profile);
      const savedUser = response.data?.user;

      if (!savedUser) {
        throw new Error("The server did not return the updated profile.");
      }

      const updatedProfile = {
        name: savedUser.name || "",
        phone: savedUser.phone || "",
        email: savedUser.email || "",
        address: savedUser.address || "",
      };

      setProfile(updatedProfile);

      const localUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ ...localUser, ...savedUser })
      );

      setEditingProfile(false);
      setProfileMessage("Your profile has been saved successfully.");

      await fetchBookings();
    } catch (err) {
      console.error("Error saving profile:", err);

      setProfileError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save your profile. Please try again."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelProfileEdit = () => {
    const localUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    setProfile({
      name: localUser.name || profile.name,
      phone: localUser.phone || profile.phone,
      email: localUser.email || profile.email,
      address: localUser.address || profile.address,
    });

    setEditingProfile(false);
    setProfileError("");
    setProfileMessage("");
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "accepted":
        return <FaCheckCircle />;
      case "rejected":
      case "cancelled":
        return <FaExclamationCircle />;
      default:
        return <FaHourglassHalf />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const SidebarLink = ({ to, icon, children }) => {
    const isBookingsLink = to === "/profile#my-bookings";
    const isProfileLink = to === "/profile#my-profile";
    const isSavedWorkersLink = to === "/saved-workers";

    const isActive =
      (isBookingsLink && location.hash === "#my-bookings") ||
      (isProfileLink && location.hash === "#my-profile") ||
      (isSavedWorkersLink && location.pathname === "/saved-workers") ||
      (to === "/profile" &&
        location.pathname === "/profile" &&
        !location.hash);

    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#171717] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <Link
            to="/profile"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
              <FaTools size={20} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Work<span className="text-orange-500">Near</span>
              </h1>
              <p className="mt-0.5 text-xs text-gray-400">
                Customer dashboard
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Menu
        </p>

        <nav className="space-y-2">
          <SidebarLink to="/profile" icon={<FaHome size={17} />}>
            Dashboard
          </SidebarLink>

          <SidebarLink to="/" icon={<FaHome size={17} />}>
            Go to Home
          </SidebarLink>

          <SidebarLink to="/workers" icon={<FaSearch size={17} />}>
            Find a Worker
          </SidebarLink>

          <SidebarLink
            to="/profile#my-bookings"
            icon={<FaCalendarAlt size={17} />}
          >
            My Bookings
          </SidebarLink>

          <SidebarLink to="/saved-workers" icon={<FaHeart size={17} />}>
            Saved Workers
          </SidebarLink>

          <SidebarLink
            to="/profile#my-profile"
            icon={<FaUser size={17} />}
          >
            My Profile
          </SidebarLink>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="mb-4 rounded-2xl bg-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
              {(profile.name || "U").charAt(0).toUpperCase()}
            </div>

            <p className="mt-3 truncate text-sm font-semibold text-white">
              {profile.name || "Customer"}
            </p>

            <p className="mt-1 truncate text-xs text-gray-400">
              {profile.email || "Welcome to WorkNear"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <FaSignOutAlt size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-72">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm"
            >
              <FaBars />
              Menu
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
            >
              <FaHome />
              Home
            </Link>
          </div>

          <section className="relative overflow-hidden rounded-3xl bg-[#171717] p-6 text-white sm:p-9">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-orange-300">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Your personal dashboard
              </span>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                Hello, {profile.name?.split(" ")[0] || "there"}!
                <br />
                <span className="text-orange-400">
                  How can we help you today?
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-gray-300 sm:text-base">
                Manage your bookings, track service requests, and find trusted
                professionals near you.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  <FaHome size={15} />
                  Go to Home
                </Link>

                <Link
                  to="/workers"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  <FaSearch size={15} />
                  Find a Worker
                  <FaArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-orange-500/10 sm:right-10 sm:top-0" />
            <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-orange-500/10 blur-2xl" />
          </section>

          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <FaCalendarAlt size={20} />
              </div>
              <p className="mt-5 text-sm text-gray-500">Total bookings</p>
              <p className="mt-1 text-3xl font-bold">{totalBookings}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FaClock size={20} />
              </div>
              <p className="mt-5 text-sm text-gray-500">Pending / accepted</p>
              <p className="mt-1 text-3xl font-bold">{pendingBookings}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FaCheckCircle size={20} />
              </div>
              <p className="mt-5 text-sm text-gray-500">Completed bookings</p>
              <p className="mt-1 text-3xl font-bold">{completedBookings}</p>
            </div>
          </section>

          <section id="my-bookings" className="mt-10 scroll-mt-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                  Service activity
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  My Bookings
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Track your bookings and review completed services.
                </p>
              </div>

              <span className="w-fit rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600">
                {totalBookings} {totalBookings === 1 ? "booking" : "bookings"}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search your bookings..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "All",
                  "Pending",
                  "Accepted",
                  "Completed",
                  "Rejected",
                  "Cancelled",
                ].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                      activeFilter === filter
                        ? "bg-orange-500 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                <p className="mt-4 text-sm font-medium text-gray-600">
                  Loading your bookings...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                  <FaExclamationCircle className="mt-0.5 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Unable to load bookings
                    </h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <button
                      type="button"
                      onClick={fetchBookings}
                      className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && filteredBookings.length === 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <FaCalendarAlt size={25} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {bookings.length === 0
                    ? "No bookings yet"
                    : "No matching bookings"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  {bookings.length === 0
                    ? "When you book a professional, your booking details will appear here."
                    : "Try another status filter or search term."}
                </p>

                {bookings.length === 0 && (
                  <Link
                    to="/workers"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    Find a professional
                    <FaArrowRight size={12} />
                  </Link>
                )}
              </div>
            )}

            {!loading && !error && filteredBookings.length > 0 && (
              <div className="mt-6 space-y-4">
                {filteredBookings.map((booking) => {
                  const worker = booking.worker;

                  const workerName =
                    worker?.user?.name ||
                    worker?.name ||
                    "Service professional";

                  const workerImage =
                    worker?.profileImage ||
                    worker?.user?.profileImage ||
                    "";

                  const category =
                    worker?.category ||
                    worker?.skill ||
                    "General service";

                  const status = booking.status || "Pending";
                  const workerId = worker?._id || worker?.id;

                  const workerPhone =
                    status.toLowerCase() === "accepted"
                      ? worker?.user?.phone
                      : "";

                  return (
                    <article
                      key={booking._id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-4">
                          {workerId ? (
                            <Link
                              to={`/worker/${workerId}`}
                              aria-label={`View ${workerName}'s profile`}
                              className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-orange-50 ring-offset-2 transition hover:ring-2 hover:ring-orange-400"
                            >
                              {workerImage ? (
                                <img
                                  src={workerImage}
                                  alt={workerName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-xl text-orange-600">
                                  <FaTools />
                                </span>
                              )}
                            </Link>
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                              <FaTools size={23} />
                            </div>
                          )}

                          <div className="min-w-0">
                            {workerId ? (
                              <Link
                                to={`/worker/${workerId}`}
                                className="break-words text-lg font-bold transition hover:text-orange-600"
                              >
                                {workerName}
                              </Link>
                            ) : (
                              <h3 className="break-words text-lg font-bold">
                                {workerName}
                              </h3>
                            )}

                            <p className="mt-1 text-sm font-medium text-orange-600">
                              {category}
                            </p>

                            {workerId && (
                              <Link
                                to={`/worker/${workerId}`}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-orange-600"
                              >
                                View worker profile
                                <FaArrowRight size={10} />
                              </Link>
                            )}

                            <p className="mt-2 break-all text-xs text-gray-400">
                              Booking ID: {booking._id}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(status)}`}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="mt-1 shrink-0 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500">Booking date</p>
                            <p className="mt-1 text-sm font-semibold">
                              {formatDate(booking.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaClock className="mt-1 shrink-0 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500">Preferred time</p>
                            <p className="mt-1 text-sm font-semibold">
                              {booking.time || "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaTools className="mt-1 shrink-0 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500">Service request</p>
                            <p className="mt-1 break-words text-sm font-semibold">
                              {booking.problem || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {status.toLowerCase() === "accepted" && (
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
                              <FaPhone size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold text-blue-900">
                                Your booking has been accepted!
                              </p>
                              <p className="mt-1 text-xs text-blue-800">
                                You can contact your service professional.
                              </p>

                              {workerPhone ? (
                                <a
                                  href={`tel:${workerPhone}`}
                                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
                                >
                                  <FaPhone size={12} />
                                  {workerPhone}
                                </a>
                              ) : (
                                <p className="mt-3 text-sm text-blue-800">
                                  A phone number is not available.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        {status.toLowerCase() === "completed" && workerId && (
                          <Link
                            to={`/add-review/${workerId}/${booking._id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
                          >
                            <FaStar size={14} />
                            Write a Review
                          </Link>
                        )}

                        {workerId && (
                          <Link
                            to={`/register-complaint/${workerId}/${booking._id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                          >
                            <FaExclamationCircle size={13} />
                            Raise a complaint
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section id="my-profile" className="mt-10 scroll-mt-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <FaUser size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">My Profile</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your contact information for bookings.
                    </p>
                  </div>
                </div>

                {!editingProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMessage("");
                      setProfileError("");
                      setEditingProfile(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    <FaEdit size={13} />
                    Edit profile
                  </button>
                )}
              </div>

              {profileMessage && (
                <p
                  role="status"
                  className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
                >
                  {profileMessage}
                </p>
              )}

              {profileError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {profileError}

                  {!editingProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(true);
                        setProfileError("");
                      }}
                      className="ml-2 font-bold underline"
                    >
                      Edit profile
                    </button>
                  )}
                </div>
              )}

              {profileLoading ? (
                <p className="mt-6 text-sm text-gray-500">
                  Loading your profile...
                </p>
              ) : editingProfile ? (
                <form onSubmit={handleProfileSave} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="profile-name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Full name
                      </label>
                      <input
                        id="profile-name"
                        name="name"
                        type="text"
                        value={profile.name}
                        onChange={handleProfileChange}
                        required
                        minLength={2}
                        maxLength={80}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Phone number
                      </label>
                      <input
                        id="profile-phone"
                        name="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        required
                        maxLength={20}
                        placeholder="Enter your phone number"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="profile-email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <input
                        id="profile-email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        required
                        placeholder="Enter your email address"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Changing your email here does not verify ownership
                        of the new email address.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="profile-address"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Service address
                      </label>
                      <textarea
                        id="profile-address"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        required
                        maxLength={300}
                        rows={3}
                        placeholder="House name or number, street, area, city"
                        className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaSave size={14} />
                      {savingProfile ? "Saving..." : "Save profile"}
                    </button>

                    <button
                      type="button"
                      disabled={savingProfile}
                      onClick={handleCancelProfileEdit}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                      <FaTimesCircle size={14} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaUser size={13} />
                      <p className="text-xs font-medium uppercase tracking-wider">
                        Full name
                      </p>
                    </div>
                    <p className="mt-2 break-words text-sm font-semibold">
                      {profile.name || "Not added yet"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaPhone size={13} />
                      <p className="text-xs font-medium uppercase tracking-wider">
                        Phone number
                      </p>
                    </div>
                    <p className="mt-2 break-words text-sm font-semibold">
                      {profile.phone || "Not added yet"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaEnvelope size={13} />
                      <p className="text-xs font-medium uppercase tracking-wider">
                        Email address
                      </p>
                    </div>
                    <p className="mt-2 break-words text-sm font-semibold">
                      {profile.email || "Not added yet"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaMapMarkerAlt size={13} />
                      <p className="text-xs font-medium uppercase tracking-wider">
                        Service address
                      </p>
                    </div>
                    <p className="mt-2 break-words text-sm font-semibold">
                      {profile.address || "Not added yet"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
