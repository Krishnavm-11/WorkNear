
import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiUser,
  FiTool,
  FiRefreshCw,
  FiClipboard,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
} from "react-icons/fi";

import api from "../../services/api";

function BookingView() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get("/admin/bookings");

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.bookings)
          ? res.data.bookings
          : [];

      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const getStatus = (status) =>
    String(status || "Pending").toLowerCase();

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "All" ||
        getStatus(booking.status) === statusFilter.toLowerCase();

      const searchableValues = [
        booking.worker?.category,
        booking.user?.name,
        booking.worker?.user?.name,
        booking.problem,
        booking.date,
        booking.time,
        booking.status,
        booking._id,
      ];

      const matchesSearch = searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: FiClipboard,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pending",
      value: bookings.filter(
        (booking) => getStatus(booking.status) === "pending"
      ).length,
      icon: FiClock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: bookings.filter(
        (booking) => getStatus(booking.status) === "completed"
      ).length,
      icon: FiCheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Rejected",
      value: bookings.filter(
        (booking) => getStatus(booking.status) === "rejected"
      ).length,
      icon: FiXCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const getStatusStyle = (status) => {
    const value = getStatus(status);

    if (value === "completed") {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (value === "pending") {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    if (value === "rejected") {
      return "bg-red-50 text-red-700 ring-red-200";
    }

    return "bg-blue-50 text-blue-700 ring-blue-200";
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-600">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              WORKNEAR ADMINISTRATION
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Booking Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Monitor customer requests and manage service bookings.
            </p>
          </div>

          <button
            type="button"
            onClick={getBookings}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              size={17}
            />
            Refresh bookings
          </button>
        </div>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-3xl font-bold tracking-tight text-gray-950">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Booking records
                </p>
              </div>
            );
          })}
        </section>

        {/* Search and filters */}
        <section className="mb-6 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All service bookings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search customers, workers, or booking details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <FiSearch
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                />
              </div>

              <div className="relative sm:w-44">
                <FiFilter
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
                >
                  <option value="All">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FiAlertCircle
                className="mt-0.5 shrink-0 text-red-600"
                size={21}
              />

              <div>
                <p className="font-semibold text-red-800">
                  Could not load bookings
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {errorMessage}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={getBookings}
              className="w-fit rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-5 h-12 w-12 rounded-xl bg-gray-100" />
                <div className="mb-3 h-5 w-2/3 rounded bg-gray-100" />
                <div className="mb-6 h-4 w-1/2 rounded bg-gray-100" />
                <div className="mb-3 h-12 rounded-xl bg-gray-100" />
                <div className="mb-3 h-12 rounded-xl bg-gray-100" />
                <div className="h-10 w-28 rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        ) : !errorMessage && filteredBookings.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <FiClipboard size={29} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {bookings.length === 0
                ? "No bookings yet"
                : "No matching bookings"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {bookings.length === 0
                ? "Customer service requests will appear here when bookings are created."
                : "Try another search term or change the selected status filter."}
            </p>

            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-5 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : !errorMessage ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {filteredBookings.length}
                </span>{" "}
                of {bookings.length} bookings
              </p>
            </div>

            {/* Booking cards */}
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredBookings.map((booking) => {
                const status = booking.status || "Pending";

                return (
                  <article
                    key={booking._id}
                    className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-gray-200/60"
                  >
                    {/* Card heading */}
                    <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5 sm:p-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                          <FiTool size={22} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Service category
                          </p>

                          <h3 className="mt-1 truncate text-lg font-bold text-gray-900">
                            {booking.worker?.category || "Service booking"}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(
                          status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {status}
                      </span>
                    </div>

                    {/* Booking information */}
                    <div className="space-y-4 p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                          <FiUser size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-400">
                            Customer
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                            {booking.user?.name || "Customer"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                          <FiTool size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-400">
                            Assigned worker
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                            {booking.worker?.user?.name || "Worker"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiCalendar size={15} />
                            <span className="text-xs font-medium">
                              Date
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold text-gray-800">
                            {formatDate(booking.date)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <div className="flex items-center gap-2 text-gray-400">
                            <FiClock size={15} />
                            <span className="text-xs font-medium">
                              Time
                            </span>
                          </div>

                          <p className="mt-2 break-words text-sm font-semibold text-gray-800">
                            {booking.time || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {booking.problem && (
                        <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                            Customer's request
                          </p>

                          <p className="mt-2 break-words text-sm leading-6 text-gray-700">
                            {booking.problem}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xs text-gray-400">
                          Booking reference
                        </span>

                        <span
                          title={booking._id}
                          className="max-w-[55%] truncate rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600"
                        >
                          {booking._id || "N/A"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        ) : null}

        <footer className="mt-10 border-t border-gray-200 py-5 text-center">
          <p className="text-xs text-gray-400">
            WorkNear · Booking Management
          </p>
        </footer>
      </div>
    </main>
  );
}

export default BookingView;
