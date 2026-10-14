
import { useEffect, useState } from "react";
import WorkerCard from "./WorkerCard";
import api from "../services/api";

function FeaturedWorkers() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    getFeaturedWorkers();
  }, []);

  const getFeaturedWorkers = async () => {
    try {
      const res = await api.get("/workers/featured");
      setWorkers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-7xl">
        {workers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <WorkerCard key={worker._id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-[#faf9f6] px-6 py-12 text-center">
            <p className="text-base font-semibold text-gray-700">
              No featured workers available yet.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedWorkers;
