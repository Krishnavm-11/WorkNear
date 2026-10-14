
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaArrowRight,
  FaShieldAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Hero() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      navigate("/workers");
      return;
    }

    navigate(`/workers?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section className="relative overflow-hidden bg-[#171717] text-white">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            LOCAL SERVICES, MADE SIMPLE
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find trusted workers.
            <span className="mt-2 block text-orange-500">
              Get life moving.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-gray-400">
            Discover skilled electricians, plumbers, tutors, cleaners, and
            other local professionals in one place.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <FaSearch className="shrink-0 text-orange-500" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What service do you need?"
                aria-label="Search for workers"
                className="w-full min-w-0 bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Search
              <FaArrowRight />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-5 text-xs text-gray-400 sm:text-sm">
            <span className="flex items-center gap-2">
              <FaShieldAlt className="text-orange-500" />
              Secure accounts
            </span>

            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-500" />
              Local professionals
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=85"
            alt="Professional electrician working"
            className="h-[300px] w-full object-cover sm:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
