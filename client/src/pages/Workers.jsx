import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaRupeeSign,
  FaSearch,
  FaBookmark,
  FaRegBookmark,
  FaArrowRight,
  FaUserTie,
  FaTimes,
} from "react-icons/fa";

import api from "../services/api";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "";

  const [search, setSearch] = useState(searchFromUrl);

  const [savedWorkers, setSavedWorkers] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("savedWorkers") || "[]"
      );

      return Array.isArray(saved) ? saved.map(String) : [];
    } catch {
      return [];
    }
  });

  const categories = [
    "All",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Cleaner",
    "Tutor",
    "Painter",
  ];

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);

  // Synchronize saved workers with other components
  useEffect(() => {
    const syncSavedWorkers = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("savedWorkers") || "[]"
        );

        setSavedWorkers(
          Array.isArray(saved) ? saved.map(String) : []
        );
      } catch {
        setSavedWorkers([]);
      }
    };

    window.addEventListener("savedWorkersUpdated", syncSavedWorkers);
    window.addEventListener("storage", syncSavedWorkers);

    return () => {
      window.removeEventListener(
        "savedWorkersUpdated",
        syncSavedWorkers
      );

      window.removeEventListener("storage", syncSavedWorkers);
    };
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/workers");

      if (Array.isArray(response.data)) {
        setWorkers(response.data);
      } else {
        setWorkers(response.data.workers || []);
      }
    } catch (error) {
      console.error("Error loading workers:", error);

      setError(
        error.response?.data?.message ||
          "Workers could not be loaded. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (categoryFromUrl) {
      params.category = categoryFromUrl;
    }

    setSearchParams(params);
  };

  const handleCategory = (category) => {
    const params = {};

    if (category !== "All") {
      params.category = category;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  const toggleSavedWorker = (workerId) => {
    const id = String(workerId);

    const updatedSavedWorkers = savedWorkers.includes(id)
      ? savedWorkers.filter((savedId) => savedId !== id)
      : [...savedWorkers, id];

    setSavedWorkers(updatedSavedWorkers);

    localStorage.setItem(
      "savedWorkers",
      JSON.stringify(updatedSavedWorkers)
    );

    window.dispatchEvent(new Event("savedWorkersUpdated"));
  };

  const filteredWorkers = workers.filter((worker) => {
    const workerName =
      worker.user?.name?.toLowerCase() ||
      worker.name?.toLowerCase() ||
      "";

    const workerCategory = worker.category?.toLowerCase() || "";
    const workerLocation = worker.location?.toLowerCase() || "";

    const searchValue = searchFromUrl.toLowerCase().trim();
    const selectedCategory = categoryFromUrl.toLowerCase();

    const matchesSearch =
      !searchValue ||
      workerName.includes(searchValue) ||
      workerCategory.includes(searchValue) ||
      workerLocation.includes(searchValue);

    const matchesCategory =
      !selectedCategory || workerCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#191919]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10 sm:h-96 sm:w-96" />

        <div className="pointer-events-none absolute -right-10 -top-12 h-64 w-64 rounded-full border border-orange-500/20" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-orange-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">
                Find your professional
              </p>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The right person.
              <br />
              <span className="text-orange-500">
                For the job that matters.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Discover local professionals, compare their experience,
              and find the right person for your next task.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <FaUserTie className="text-orange-500" />
                Local professionals
              </span>

              <span className="flex items-center gap-2">
                <FaBriefcase className="text-orange-500" />
                Multiple service categories
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-orange-500" />
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-12">
        <div className="border-b border-neutral-200 pb-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                Explore WorkNear
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Find your local expert
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Search by name, service, or location.
              </p>
            </div>

            {/* SEARCH FORM */}
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-lg"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-l-xl border border-r-0 border-neutral-200 bg-white px-4 transition focus-within:border-orange-500">
                <FaSearch className="shrink-0 text-orange-500" />

                <input
                  type="text"
                  placeholder="Search workers or services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="min-w-0 w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-neutral-400"
                />

                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearch("");

                      const params = {};

                      if (categoryFromUrl) {
                        params.category = categoryFromUrl;
                      }

                      setSearchParams(params);
                    }}
                    className="shrink-0 text-neutral-400 transition hover:text-orange-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="shrink-0 rounded-r-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:px-6"
              >
                Search
              </button>
            </form>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mt-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Browse by category
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive =
                  category === "All"
                    ? categoryFromUrl === ""
                    : categoryFromUrl.toLowerCase() ===
                      category.toLowerCase();

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategory(category)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition duration-200 sm:text-sm ${
                      isActive
                        ? "border-[#171717] bg-[#171717] text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-orange-500 hover:text-orange-600"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* WORKER LIST */}
      <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        {/* RESULTS HEADER */}
        {!loading && !error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">
                {categoryFromUrl
                  ? `${categoryFromUrl} professionals`
                  : "Available professionals"}
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                {filteredWorkers.length}{" "}
                {filteredWorkers.length === 1
                  ? "professional"
                  : "professionals"}{" "}
                found
              </p>
            </div>

            <Link
              to="/saved-workers"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-orange-300 hover:text-orange-600"
            >
              <FaBookmark className="text-orange-500" />
              Saved workers
              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600">
                {savedWorkers.length}
              </span>
            </Link>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2"
              >
                <div className="aspect-[4/3] rounded-xl bg-neutral-200" />

                <div className="space-y-3 p-3">
                  <div className="h-4 w-2/3 rounded bg-neutral-200" />
                  <div className="h-3 w-1/3 rounded bg-neutral-200" />
                  <div className="h-3 w-full rounded bg-neutral-100" />
                  <div className="h-3 w-4/5 rounded bg-neutral-100" />
                  <div className="h-9 rounded-lg bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-14 text-center">
            <p className="text-lg font-semibold text-neutral-800">
              Something went wrong
            </p>

            <p className="mt-2 text-sm text-neutral-500">{error}</p>

            <button
              type="button"
              onClick={fetchWorkers}
              className="mt-6 rounded-xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Try again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredWorkers.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <FaSearch size={20} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              No workers found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
              We couldn't find a professional matching your search.
              Try another keyword or choose a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* PREMIUM WORKER CARDS */}
        {!loading && !error && filteredWorkers.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWorkers.map((worker) => {
              const workerId = String(worker._id);
              const isSaved = savedWorkers.includes(workerId);

              const workerName =
                worker.user?.name || worker.name || "Worker";

              const workerImage =
                worker.profileImage ||
                worker.user?.profileImage ||
                "https://placehold.co/600x450?text=Worker";

              const workerPrice = worker.pricing ?? worker.price;

              return (
                <article
                  key={worker._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-black/[0.06]"
                >
                  {/* IMAGE — CONSISTENT 4:3 PROPORTION */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                    <img
                      src={workerImage}
                      alt={workerName}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/600x450?text=Worker";
                      }}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* CATEGORY BADGE */}
                    <div className="absolute bottom-3 left-3 max-w-[75%]">
                      <span className="inline-block truncate rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-neutral-800 shadow-sm">
                        {worker.category || "Professional"}
                      </span>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => toggleSavedWorker(worker._id)}
                      aria-label={
                        isSaved
                          ? `Remove ${workerName} from saved workers`
                          : `Save ${workerName}`
                      }
                      aria-pressed={isSaved}
                      title={
                        isSaved
                          ? "Remove from saved workers"
                          : "Save worker"
                      }
                      className={`absolute right-3 top-3 flex h-9 items-center justify-center gap-1.5 rounded-full px-3 shadow-sm transition duration-200 ${
                        isSaved
                          ? "bg-orange-500 text-white"
                          : "bg-white/95 text-neutral-800 hover:bg-orange-500 hover:text-white"
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <FaBookmark size={12} />
                          <span className="text-[11px] font-semibold">
                            Saved
                          </span>
                        </>
                      ) : (
                        <FaRegBookmark size={14} />
                      )}
                    </button>
                  </div>

                  {/* CARD DETAILS */}
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
                    <div>
                      <h3
                        title={workerName}
                        className="truncate text-base font-semibold tracking-tight text-[#171717]"
                      >
                        {workerName}
                      </h3>

                      <p className="mt-1 truncate text-xs font-medium text-orange-600">
                        {worker.category || "Local professional"}
                      </p>
                    </div>

                    {/* WORKER INFORMATION */}
                    <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
                      <p className="flex items-start gap-2.5 text-xs leading-5 text-neutral-600">
                        <FaMapMarkerAlt className="mt-0.5 shrink-0 text-orange-500" />

                        <span className="line-clamp-2">
                          {worker.location || "Location unavailable"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2.5 text-xs text-neutral-600">
                        <FaBriefcase className="shrink-0 text-orange-500" />

                        <span>
                          {worker.experience ?? 0} years experience
                        </span>
                      </p>

                      <p className="flex items-center gap-2.5 text-xs text-neutral-600">
                        <FaRupeeSign className="shrink-0 text-orange-500" />

                        <span className="truncate font-semibold text-neutral-800">
                          {workerPrice !== undefined &&
                          workerPrice !== null &&
                          workerPrice !== ""
                            ? workerPrice
                            : "Price unavailable"}
                        </span>
                      </p>
                    </div>

                    {/* VIEW PROFILE */}
                    <Link
                      to={`/worker/${worker._id}`}
                      className="mt-5 flex items-center justify-between rounded-xl bg-[#171717] px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-500"
                    >
                      <span>View profile</span>

                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      
    </div>
  );
}

export default Workers;