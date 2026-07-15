import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBill, FaBriefcase, FaTools } from "react-icons/fa";
import api from "../services/api";

function WorkerDetails() {
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getWorker();
    getReviews();
  }, []);

  const getWorker = async () => {
    try {
      const res = await api.get("/workers/" + id);
      setWorker(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async () => {
    try {
      const res = await api.get("/reviews/" + id);
      setReviews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!worker) {
    return <h2 className="text-center mt-20 text-3xl">Loading...</h2>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden grid md:grid-cols-2">
        <img
          src={worker.profileImage}
          alt="Worker"
          className="w-full h-full object-cover"
        />

        <div className="p-10">
          <h1 className="text-4xl font-bold">{worker.user?.name}</h1>

          <p className="text-orange-500 text-xl mt-2">
            {worker.category}
          </p>

          <div className="flex items-center gap-2 mt-6">
            <FaMapMarkerAlt />
            <span>{worker.location}</span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <FaMoneyBill />
            <span>₹{worker.pricing}</span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <FaBriefcase />
            <span>{worker.experience} Years Experience</span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <FaTools />
            <span>{worker.skills}</span>
          </div>

          <Link
            to={"/booking/" + worker._id}
            className="inline-block mt-8 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Book Now
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow">
            No Reviews Yet
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 rounded-lg shadow mb-5"
            >
              <h3 className="font-bold text-xl">
                {review.user?.name}
              </h3>

              <p className="text-yellow-500 mt-2">
                ⭐ {review.rating}/5
              </p>

              <p className="mt-3 text-gray-700">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WorkerDetails;