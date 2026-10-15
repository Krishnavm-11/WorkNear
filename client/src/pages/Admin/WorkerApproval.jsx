import { useEffect, useState } from "react";
import { FaTrash, FaCheckCircle } from "react-icons/fa";
import {
  FiSearch,
  FiUsers,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiShield,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import api from "../../services/api";

function WorkerApproval() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getWorkers();
  }, []);

  const getWorkers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/workers/all");
      setWorkers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Unable to load workers. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveWorker = async (id) => {
    try {
      setActionLoading(id);
      setMessage(null);

      await api.put("/workers/approve/" + id);

      setWorkers((prev) =>
        prev.map((worker) =>
          worker._id === id
            ? { ...worker, isApproved: true }
            : worker
        )
      );

      setMessage({
        type: "success",
        text: "Worker approved successfully.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to approve worker. Please try again.",
      });
    } finally {
      setActionLoading("");
    }
  };

  const deleteWorker = async () => {
    if (!selectedWorker) return;

    const id = selectedWorker._id;

    try {
      setActionLoading(id);
      setMessage(null);

      await api.delete("/admin/worker/" + id);

      setWorkers((prev) =>
        prev.filter((worker) => worker._id !== id)
      );

      setSelectedWorker(null);
      setMessage({
        type: "success",
        text: "Worker deleted successfully.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to delete worker. Please try again.",
      });
    } finally {
      setActionLoading("");
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const name = worker.user?.name || "";
    const category = worker.category || "";
    const location = worker.location || "";

    const matchesSearch = `${name} ${category} ${location}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Approved" && worker.isApproved) ||
      (filter === "Pending" && !worker.isApproved);

    return matchesSearch && matchesFilter;
  });

  const totalWorkers = workers.length;
  const approvedWorkers = workers.filter(
    (worker) => worker.isApproved
  ).length;
  const pendingWorkers = totalWorkers - approvedWorkers;

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#171717] sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-orange-700">
              <FiShield />
              Administration
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Worker Approval
              <span className="text-orange-500">.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Review worker profiles, verify their details, and manage
              platform approvals.
            </p>
          </div>

          <button
            type="button"
            onClick={getWorkers}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {message && (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <FiCheck className="mt-0.5 shrink-0" />
            ) : (
              <FiAlertCircle className="mt-0.5 shrink-0" />
            )}

            <p className="flex-1 text-sm font-medium">
              {message.text}
            </p>

            <button
              type="button"
              onClick={() => setMessage(null)}
              className="rounded p-1 hover:bg-black/5"
              aria-label="Dismiss message"
            >
              <FiX />
            </button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total workers"
            value={totalWorkers}
            icon={<FiUsers />}
            description="Registered on the platform"
            iconStyle="bg-gray-100 text-gray-800"
          />

          <SummaryCard
            title="Approved"
            value={approvedWorkers}
            icon={<FaCheckCircle />}
            description="Ready to receive customers"
            iconStyle="bg-green-50 text-green-600"
          />

          <SummaryCard
            title="Awaiting approval"
            value={pendingWorkers}
            icon={<FiClock />}
            description="Require admin review"
            iconStyle="bg-orange-50 text-orange-600"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_35px_rgba(0,0,0,0.035)]">
          <div className="border-b border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Worker directory</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredWorkers.length}{" "}
                  {filteredWorkers.length === 1 ? "worker" : "workers"} found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative sm:min-w-[260px]">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, category, location..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                <div className="flex rounded-xl bg-gray-100 p-1">
                  {["All", "Pending", "Approved"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                        filter === item
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-[#fafaf9] text-[11px] uppercase tracking-[0.12em] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Worker</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <FiRefreshCw className="mx-auto mb-3 animate-spin text-2xl text-orange-500" />
                      <p className="text-sm text-gray-500">
                        Loading worker directory...
                      </p>
                    </td>
                  </tr>
                ) : filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker) => (
                    <tr
                      key={worker._id}
                      className="transition hover:bg-orange-50/30"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#191919] text-sm font-bold text-orange-400">
                            {(worker.user?.name || "W")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {worker.user?.name || "Unknown worker"}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              ID: {worker._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
                          <FiBriefcase className="text-gray-400" />
                          {worker.category || "Not specified"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                          <FiMapPin className="shrink-0 text-orange-500" />
                          {worker.location || "Not specified"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge approved={worker.isApproved} />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {!worker.isApproved ? (
                            <button
                              type="button"
                              onClick={() => approveWorker(worker._id)}
                              disabled={Boolean(actionLoading)}
                              title="Approve worker"
                              className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                            >
                              <FaCheckCircle />
                              Approve
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700">
                              <FiCheck />
                              Verified
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedWorker(worker)}
                            disabled={Boolean(actionLoading)}
                            title="Delete worker"
                            className="rounded-lg border border-gray-200 p-2.5 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {loading ? (
              <div className="py-12 text-center">
                <FiRefreshCw className="mx-auto mb-3 animate-spin text-2xl text-orange-500" />
                <p className="text-sm text-gray-500">Loading workers...</p>
              </div>
            ) : filteredWorkers.length === 0 ? (
              <div className="py-10 text-center">
                <EmptyState />
              </div>
            ) : (
              filteredWorkers.map((worker) => (
                <div
                  key={worker._id}
                  className="rounded-xl border border-gray-200 p-4 transition hover:border-orange-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#191919] text-base font-bold text-orange-400">
                      {(worker.user?.name || "W")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-bold">
                        {worker.user?.name || "Unknown worker"}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        ID: {worker._id.slice(-8)}
                      </p>
                      <div className="mt-3">
                        <StatusBadge approved={worker.isApproved} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <FiBriefcase className="mt-0.5 shrink-0 text-orange-500" />
                      <span>{worker.category || "Not specified"}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <FiMapPin className="mt-0.5 shrink-0 text-orange-500" />
                      <span>{worker.location || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {!worker.isApproved && (
                      <button
                        type="button"
                        onClick={() => approveWorker(worker._id)}
                        disabled={Boolean(actionLoading)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                      >
                        <FaCheckCircle />
                        Approve
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedWorker(worker)}
                      disabled={Boolean(actionLoading)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && workers.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-100 bg-[#fafaf9] px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span>
                Showing {filteredWorkers.length} of {workers.length} workers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FiShield className="text-orange-500" />
                Worker management
              </span>
            </div>
          )}
        </div>
      </div>

      {selectedWorker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !actionLoading) {
              setSelectedWorker(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-worker-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
              <FaTrash />
            </div>

            <h2
              id="delete-worker-title"
              className="text-xl font-bold text-gray-900"
            >
              Delete worker?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {selectedWorker.user?.name || "this worker"}
              </span>
              ? This action may remove the worker from the platform.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                disabled={Boolean(actionLoading)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteWorker}
                disabled={Boolean(actionLoading)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaTrash />
                {actionLoading ? "Please wait..." : "Delete worker"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  description,
  iconStyle,
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_5px_25px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 text-xl ${iconStyle}`}>
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ approved }) {
  return approved ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
      <FiCheck />
      Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
      <FiClock />
      Pending
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl text-gray-400">
        <FiUsers />
      </div>

      <p className="font-semibold text-gray-800">No workers found</p>

      <p className="mt-1 max-w-xs text-sm leading-6 text-gray-500">
        Try changing your search or selecting a different status filter.
      </p>
    </div>
  );
}

export default WorkerApproval;