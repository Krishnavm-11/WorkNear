import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBookmark,
  FaArrowLeft,
  FaArrowRight,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../services/api";

const SAVED_WORKERS_KEY = "savedWorkers";

function SavedWorkers() {
  const [workers, setWorkers] = useState([]);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(SAVED_WORKERS_KEY) || "[]"
      ).map(String);
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const readSavedIds = useCallback(() => {
    try {
      const ids = JSON.parse(
        localStorage.getItem(SAVED_WORKERS_KEY) || "[]"
      );

      setSavedIds(Array.isArray(ids) ? ids.map(String) : []);
    } catch {
      setSavedIds([]);
    }
  }, []);

  useEffect(() => {
    const handleSavedUpdate = () => readSavedIds();

    window.addEventListener("savedWorkersUpdated", handleSavedUpdate);
    window.addEventListener("storage", handleSavedUpdate);

    return () => {
      window.removeEventListener(
        "savedWorkersUpdated",
        handleSavedUpdate
      );
      window.removeEventListener("storage", handleSavedUpdate);
    };
  }, [readSavedIds]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        setError("");

        // This endpoint should return the available worker records.
        const response = await api.get("/workers");

        const data = response.data;
        const workerList = Array.isArray(data)
          ? data
          : Array.isArray(data.workers)
            ? data.workers
            : [];

        setWorkers(workerList);
      } catch (err) {
        console.error("Unable to fetch workers:", err);
        setError("We couldn't load your saved workers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const savedWorkers = workers.filter((worker) =>
    savedIds.includes(String(worker._id))
  );

  const removeSavedWorker = (worker) => {
    const updatedIds = savedIds.filter(
      (id) => id !== String(worker._id)
    );

    localStorage.setItem(
      SAVED_WORKERS_KEY,
      JSON.stringify(updatedIds)
    );

    setSavedIds(updatedIds);

    window.dispatchEvent(new Event("savedWorkersUpdated"));

    toast.info(`${worker.user?.name || "Worker"} removed from saved list.`);
  };

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-[#171717]">
      {/* Header */}
      <section className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          <Link
            to="/workers"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
          >
            <FaArrowLeft size={12} />
            Find professionals
          </Link>

          <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <FaBookmark size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                    Your collection
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                    Saved Workers
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500">
                Keep your favourite local professionals together
                and revisit their profiles whenever you need them.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-[#faf9f7] px-4 py-3">
              <FaBookmark className="text-orange-500" />
              <span className="text-sm font-semibold">
                {savedIds.length} saved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Saved worker list */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl bg-white"
              >
                <div className="h-64 bg-gray-200" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-100" />
                  <div className="h-10 rounded-lg bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-gray-800">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Try Again
            </button>
          </div>
        ) : savedWorkers.length === 0 ? (
          <div className="rounded-3xl border border-black/[0.06] bg-white px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <FaBookmark size={24} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Your saved list is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
              When you find a professional you like, tap the Save
              button on their card. They'll appear here for easy access.
            </p>

            <Link
              to="/workers"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Explore Workers
              <FaArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {savedWorkers.length}
                </span>{" "}
                saved {savedWorkers.length === 1 ? "professional" : "professionals"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedWorkers.map((worker) => (
                <article
                  key={worker._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]"
                >
                  {/* Worker image */}
                  <div className="relative h-64 overflow-hidden bg-[#f3f1ed] sm:h-72">
                    {worker.profileImage ? (
                      <img
                        src={worker.profileImage}
                        alt={worker.user?.name || "Local professional"}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-300">
                        <FaUser size={56} />
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 rounded-lg bg-black/75 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                      {worker.category || "Professional"}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSavedWorker(worker)}
                      aria-label={`Remove ${worker.user?.name || "worker"} from saved list`}
                      title="Remove from saved list"
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-red-500"
                    >
                      <FaBookmark size={15} />
                    </button>
                  </div>

                  {/* Worker information */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold">
                          {worker.user?.name || "Local Professional"}
                        </h2>

                        <p className="mt-1.5 text-sm font-medium text-orange-600">
                          {worker.category || "Local service"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                          Price
                        </p>
                        <p className="mt-1 text-xl font-bold">
                          ₹{worker.pricing ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                      <FaMapMarkerAlt className="shrink-0 text-orange-500" />
                      <span className="truncate">
                        {worker.location || "Location not specified"}
                      </span>
                    </div>

                    <Link
                      to={`/worker/${worker._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                    >
                      View Profile
                      <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </Link>

                    <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
                      <FaBookmark size={11} />
                      Saved to your list
                      <button
                        type="button"
                        onClick={() => removeSavedWorker(worker)}
                        className="ml-auto font-semibold underline underline-offset-2 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default SavedWorkers;