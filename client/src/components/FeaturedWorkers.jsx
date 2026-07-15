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

    <section className="py-20 bg-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-3">

          Top Rated Workers

        </h2>

        <p className="text-center text-gray-600 mb-12">

          Workers with the highest customer reviews

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {workers.map((worker) => (

            <WorkerCard
              key={worker._id}
              worker={worker}
            />

          ))}

        </div>

      </div>

    </section>

  );

}

export default FeaturedWorkers;