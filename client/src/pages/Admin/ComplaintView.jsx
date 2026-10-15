
import { useCallback, useEffect, useState } from "react";
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaTools,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
  FaSyncAlt,
  FaClipboardCheck,
} from "react-icons/fa";

import api from "../../services/api";
function ComplaintView() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [filter, setFilter] = useState("All");

  const getComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.get("/complaints");
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load complaints. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getComplaints();
  }, [getComplaints]);

  const resolveComplaint = async (id) => {
    try {
      setResolvingId(id);
      setMessage("");

      await api.put("/complaints/" + id);

      setComplaints((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, status: "Resolved" }
            : item
        )
      );

      setMessage("Complaint marked as resolved successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Error resolving complaint:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to resolve this complaint. Please try again."
      );
      setMessageType("error");
    } finally {
      setResolvingId("");
    }
  };

  const pendingCount = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolvedCount = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const filteredComplaints = complaints.filter((item) => {
    if (filter === "Pending") return item.status === "Pending";
    if (filter === "Resolved") return item.status === "Resolved";
    return true;
  });

  return (
    <>

      <main className="min-h-screen bg-[#f7f7f5] px-4 py-6 sm:px-6 sm:py-9 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <section className="relative overflow-hidden rounded-3xl bg-[#171717] p-6 text-white shadow-xl shadow-black/5 sm:p-9 lg:p-11">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-orange-300">
                  <FaExclamationCircle />
                  CUSTOMER SUPPORT
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Complaint
                  <span className="text-orange-400"> management.</span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
                  Review customer concerns, check the associated
                  professional, and keep every service experience
                  accountable.
                </p>
              </div>

              <button
                type="button"
                onClick={getComplaints}
                disabled={loading}
                className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-400/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                Refresh complaints
              </button>
            </div>
          </section>

          {/* Summary cards */}
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Total complaints"
              value={complaints.length}
              icon={<FaExclamationCircle />}
              description="All submitted concerns"
              iconStyle="bg-orange-50 text-orange-600"
            />

            <SummaryCard
              title="Awaiting resolution"
              value={pendingCount}
              icon={<FaClock />}
              description="Require admin attention"
              iconStyle="bg-amber-50 text-amber-600"
            />

            <SummaryCard
              title="Resolved complaints"
              value={resolvedCount}
              icon={<FaCheckCircle />}
              description="Successfully addressed"
              iconStyle="bg-emerald-50 text-emerald-600"
            />
          </section>

          {/* Feedback message */}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-6 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
                messageType === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {messageType === "success" ? (
                <FaCheckCircle className="mt-0.5 shrink-0" />
              ) : (
                <FaExclamationCircle className="mt-0.5 shrink-0" />
              )}
              <p>{message}</p>
            </div>
          )}

          {/* Complaint list heading and filters */}
          <section className="mt-9">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                  Support overview
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                  Customer complaints
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  {filteredComplaints.length}{" "}
                  {filteredComplaints.length === 1
                    ? "complaint"
                    : "complaints"}{" "}
                  displayed
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["All", "Pending", "Resolved"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      filter === item
                        ? "bg-[#171717] text-white shadow-md shadow-black/10"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {item}
                    {item === "Pending" && pendingCount > 0 && (
                      <span
                        className={`ml-2 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] ${
                          filter === item
                            ? "bg-orange-500 text-white"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6"
                  >
                    <div className="h-4 w-28 rounded bg-neutral-200" />
                    <div className="mt-5 h-6 w-2/3 rounded bg-neutral-200" />
                    <div className="mt-4 h-20 rounded-xl bg-neutral-100" />
                    <div className="mt-5 h-10 rounded-lg bg-neutral-200" />
                  </div>
                ))}
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-500">
                  <FaClipboardCheck />
                </div>

                <h3 className="mt-5 text-lg font-bold text-neutral-900">
                  {complaints.length === 0
                    ? "No complaints yet"
                    : `No ${filter.toLowerCase()} complaints`}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                  {complaints.length === 0
                    ? "Customer complaints will appear here when they are submitted."
                    : "Try another filter to see more complaints."}
                </p>

                {filter !== "All" && complaints.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter("All")}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
                  >
                    View all complaints
                    <FaArrowRight />
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredComplaints.map((item) => {
                  const isResolved = item.status === "Resolved";
                  const isResolving = resolvingId === item._id;

                  const workerUser = item.worker?.user || {};

                  return (
                    <article
                      key={item._id}
                      className="group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-neutral-900/5"
                    >
                      <div
                        className={`h-1 ${
                          isResolved
                            ? "bg-emerald-500"
                            : "bg-orange-500"
                        }`}
                      />

                      <div className="p-5 sm:p-6">
                        {/* Card heading */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                              <FaUser />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                                Submitted by
                              </p>

                              <h3 className="mt-1 break-words text-base font-bold text-neutral-900">
                                {item.user?.name || "Customer"}
                              </h3>
                            </div>
                          </div>

                          <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold ${
                              isResolved
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {isResolved ? (
                              <FaCheckCircle />
                            ) : (
                              <FaClock />
                            )}
                            {item.status || "Pending"}
                          </span>
                        </div>

                        {/* Worker details */}
                        <div className="mt-5 rounded-xl border border-neutral-100 bg-[#fafaf9] p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                              <FaTools />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                                Associated professional
                              </p>

                              <p className="mt-1 break-words text-sm font-bold text-neutral-800">
                                {workerUser.name ||
                                  item.worker?.name ||
                                  "Worker details unavailable"}
                              </p>

                              <p className="mt-1 text-xs font-medium text-orange-600">
                                {item.worker?.category ||
                                  "Service category unavailable"}
                              </p>

                              {workerUser.email && (
                                <p className="mt-3 flex items-start gap-2 break-all text-xs leading-5 text-neutral-500">
                                  <FaEnvelope className="mt-1 shrink-0 text-neutral-400" />
                                  {workerUser.email}
                                </p>
                              )}

                              {workerUser.phone && (
                                <a
                                  href={`tel:${workerUser.phone}`}
                                  className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 transition hover:text-orange-600"
                                >
                                  <FaPhoneAlt className="text-orange-500" />
                                  {workerUser.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Complaint text */}
                        <div className="mt-5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                            Complaint description
                          </p>

                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-700">
                            {item.complaint ||
                              "No complaint description provided."}
                          </p>
                        </div>

                        {/* Footer action */}
                        <div className="mt-6 border-t border-neutral-100 pt-5">
                          {isResolved ? (
                            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                              <FaCheckCircle />
                              Complaint resolved
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => resolveComplaint(item._id)}
                              disabled={Boolean(resolvingId)}
                              className="group/button flex w-full items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/15 transition hover:bg-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isResolving ? (
                                <>
                                  <FaSyncAlt className="animate-spin" />
                                  Resolving...
                                </>
                              ) : (
                                <>
                                  <FaCheckCircle />
                                  Mark as resolved
                                  <FaArrowRight className="ml-auto transition-transform group-hover/button:translate-x-1" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <p className="mt-10 text-center text-xs text-neutral-400">
            WorkNear Admin <span className="mx-1.5">·</span>
            Customer support and complaint management
          </p>
        </div>
      </main>
    </>
  );
}

function SummaryCard({ title, value, icon, description, iconStyle }) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        {description}
      </p>
    </div>
  );
}

export default ComplaintView;
