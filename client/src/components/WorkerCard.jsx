import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function WorkerCard({ worker }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 duration-300">
      
      <img
        src={worker.profileImage}
        alt={worker.user?.name}
        className="w-full h-72 object-cover object-top"
      />

      <div className="p-5">

        <h2 className="text-xl font-bold">
          {worker.user?.name}
        </h2>

        <p className="text-orange-500 font-semibold mt-1">
          {worker.category}
        </p>

        <div className="flex items-center gap-2 mt-3 text-gray-600">
          <FaMapMarkerAlt />
          <span>{worker.location}</span>
        </div>

        <div className="flex justify-between items-center mt-6">

          <h3 className="text-xl font-bold text-black">
            ₹{worker.pricing}
          </h3>

          <Link
            to={"/worker/" + worker._id}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 duration-300"
          >
            View Profile
          </Link>

        </div>

      </div>

    </div>
  );
}

export default WorkerCard;