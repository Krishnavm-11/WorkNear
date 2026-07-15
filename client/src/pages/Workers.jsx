import { useEffect, useState } from "react";
import api from "../services/api";
import WorkerCard from "../components/WorkerCard";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getWorkers();
  }, []);

  useEffect(() => {
    let data = workers;

    if (search !== "") {
      data = data.filter((worker) =>
        worker.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "") {
      data = data.filter(
        (worker) => worker.category === category
      );
    }

    setFilteredWorkers(data);

  }, [search, category, workers]);

  const getWorkers = async () => {
    try {
      const res = await api.get("/workers");

      setWorkers(res.data);
      setFilteredWorkers(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Find Trusted
            <span className="text-orange-500"> Workers</span>
          </h1>

          <p className="mt-5 text-gray-300">
            Search skilled workers near your location.
          </p>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-2 gap-5">

          <input
            type="text"
            placeholder="Search worker by name..."
            className="border rounded-lg p-4 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg p-4 outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            <option value="Electrician">Electrician</option>

            <option value="Plumber">Plumber</option>

            <option value="Carpenter">Carpenter</option>

            <option value="Painter">Painter</option>

            <option value="Cleaner">Cleaner</option>

            <option value="Tutor">Tutor</option>

            <option value="AC Repair">AC Repair</option>

            <option value="Gardener">Gardener</option>

          </select>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">

        {filteredWorkers.length > 0 ? (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker._id}
                worker={worker}
              />
            ))}

          </div>

        ) : (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold text-gray-600">
              No Workers Found
            </h2>

          </div>

        )}

      </div>

    </div>
  );
}

export default Workers;