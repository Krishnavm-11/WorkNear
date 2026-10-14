import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBookmark,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SAVED_WORKERS_KEY = "savedWorkers";

function WorkerCard({ worker }) {
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const savedWorkers = JSON.parse(
        localStorage.getItem(SAVED_WORKERS_KEY) || "[]"
      );

      return savedWorkers.some(
        (id) => String(id) === String(worker._id)
      );
    } catch {
      return false;
    }
  });

  const toggleSave = () => {
    try {
      const savedWorkers = JSON.parse(
        localStorage.getItem(SAVED_WORKERS_KEY) || "[]"
      );

      const alreadySaved = savedWorkers.some(
        (id) => String(id) === String(worker._id)
      );

      const updatedWorkers = alreadySaved
        ? savedWorkers.filter(
            (id) => String(id) !== String(worker._id)
          )
        : [...savedWorkers, worker._id];

      localStorage.setItem(
        SAVED_WORKERS_KEY,
        JSON.stringify(updatedWorkers)
      );

      setIsSaved(!alreadySaved);

      window.dispatchEvent(new Event("savedWorkersUpdated"));

      if (alreadySaved) {
        toast.info("Worker removed from saved list.");
      } else {
        toast.success("Worker added to saved list!");
      }
    } catch (error) {
      console.error("Unable to update saved workers:", error);
      toast.error("Unable to update saved workers. Please try again.");
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)]">
      {/* Worker image */}
      <div className="relative h-64 overflow-hidden bg-[#f3f1ed] sm:h-72">
        <img
          src={worker.profileImage}
          alt={worker.user?.name || "Local professional"}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Category */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-white/20 bg-black/70 px-3 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
          {worker.category}
        </div>

        {/* Save / Saved button */}
        <button
          type="button"
          onClick={toggleSave}
          aria-label={isSaved ? "Remove saved worker" : "Save worker"}
          aria-pressed={isSaved}
          title={isSaved ? "Remove from saved workers" : "Save worker"}
          className={`absolute right-4 top-4 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-md transition-all duration-300 ${
            isSaved
              ? "bg-orange-500 text-white"
              : "bg-white/95 text-gray-700 hover:bg-orange-500 hover:text-white"
          }`}
        >
          <FaBookmark size={14} />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Worker details */}
      <div className="p-5 sm:p-6">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-tight text-[#171717]">
              {worker.user?.name || "Local Professional"}
            </h2>

            <p className="mt-1.5 text-sm font-medium text-orange-600">
              {worker.category}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Price
            </p>

            <p className="mt-1 text-xl font-bold text-[#171717]">
              ₹{worker.pricing}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
          <FaMapMarkerAlt className="shrink-0 text-orange-500" />

          <span className="truncate">
            {worker.location || "Location not specified"}
          </span>
        </div>

        {/* View profile */}
        <Link
          to={`/worker/${worker._id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-orange-500"
        >
          View Profile
          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Saved status */}
        {isSaved && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
            <FaBookmark size={11} />
            This professional is in your saved list
          </div>
        )}
      </div>
    </article>
  );
}

export default WorkerCard;