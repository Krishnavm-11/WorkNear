import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaRupeeSign,
  FaSearch,
} from "react-icons/fa";

import api from "../services/api";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] =
    useSearchParams();

  const searchFromUrl =
    searchParams.get("search") || "";

  const categoryFromUrl =
    searchParams.get("category") || "";

  const [search, setSearch] =
    useState(searchFromUrl);

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

  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/workers");

      if (Array.isArray(response.data)) {
        setWorkers(response.data);
      } else {
        setWorkers(response.data.workers || []);
      }
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Workers could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = {};

    if (search.trim() !== "") {
      params.search = search.trim();
    }

    if (categoryFromUrl !== "") {
      params.category = categoryFromUrl;
    }

    setSearchParams(params);
  };

  const handleCategory = (category) => {
    const params = {};

    if (category !== "All") {
      params.category = category;
    }

    if (search.trim() !== "") {
      params.search = search.trim();
    }

    setSearchParams(params);
  };

  const filteredWorkers = workers.filter(
    (worker) => {
      const workerName =
        worker.user?.name?.toLowerCase() ||
        worker.name?.toLowerCase() ||
        "";

      const workerCategory =
        worker.category?.toLowerCase() || "";

      const workerLocation =
        worker.location?.toLowerCase() || "";

      const searchValue =
        searchFromUrl.toLowerCase().trim();

      const selectedCategory =
        categoryFromUrl.toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        workerName.includes(searchValue) ||
        workerCategory.includes(searchValue) ||
        workerLocation.includes(searchValue);

      const matchesCategory =
        selectedCategory === "" ||
        workerCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    }
  );

  return (
    <div className="min-h-screen bg-gray-100 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-orange-500 font-semibold">
            Find local professionals
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Available Workers
          </h1>

          <p className="text-gray-600 mt-3">
            Search workers by name, category or
            location.
          </p>
        </div>

        {/* Search form */}

        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-8 flex"
        >
          <div className="bg-white flex items-center px-5 rounded-l-xl border border-gray-200 w-full">
            <FaSearch className="text-orange-500" />

            <input
              type="text"
              placeholder="Search name or category"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full px-4 py-4 outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white px-7 rounded-r-xl hover:bg-orange-600"
          >
            Search
          </button>
        </form>

        {/* Category buttons */}

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const isActive =
              category === "All"
                ? categoryFromUrl === ""
                : categoryFromUrl.toLowerCase() ===
                  category.toLowerCase();

            return (
              <button
                key={category}
                onClick={() =>
                  handleCategory(category)
                }
                className={
                  isActive
                    ? "bg-orange-500 text-white px-5 py-2 rounded-lg"
                    : "bg-white text-black px-5 py-2 rounded-lg border hover:text-orange-500"
                }
              >
                {category}
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="text-center text-gray-600">
            Loading workers...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          filteredWorkers.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center">
              <h2 className="text-2xl font-bold">
                No workers found
              </h2>

              <p className="text-gray-600 mt-2">
                Try another name or category.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredWorkers.length > 0 && (
            <>
              <p className="text-gray-600 mb-6">
                {filteredWorkers.length} workers
                found
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker._id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden"
                  >
                    <img
                      src={
                        worker.profileImage ||
                        "https://placehold.co/600x400?text=Worker"
                      }
                      alt={
                        worker.user?.name ||
                        worker.name ||
                        "Worker"
                      }
                      className="w-full h-60 object-cover"
                    />

                    <div className="p-6">
                      <h2 className="text-xl font-bold">
                        {worker.user?.name ||
                          worker.name ||
                          "Worker"}
                      </h2>

                      <p className="text-orange-500 font-semibold mt-1">
                        {worker.category}
                      </p>

                      <div className="space-y-3 mt-5 text-gray-600">
                        <p className="flex items-center gap-3">
                          <FaMapMarkerAlt className="text-orange-500" />
                          {worker.location ||
                            "Location unavailable"}
                        </p>

                        <p className="flex items-center gap-3">
                          <FaBriefcase className="text-orange-500" />
                          {worker.experience || 0} years
                          experience
                        </p>

                        <p className="flex items-center gap-3">
                          <FaRupeeSign className="text-orange-500" />
                          {worker.pricing ||
                            worker.price ||
                            "Price unavailable"}
                        </p>
                      </div>

                      <Link
                        to={`/worker/${worker._id}`}
                        className="block text-center bg-black text-white mt-6 py-3 rounded-lg hover:bg-orange-500"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}

export default Workers;