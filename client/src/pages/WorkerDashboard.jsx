import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function WorkerDashboard() {
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getWorkerProfile();
    getBookings();
  }, []);

  const getWorkerProfile = async () => {
    try {
      const res = await api.get("/workers/my-profile");
      setWorker(res.data);
    } catch (error) {
      setWorker(null);
    }
  };

  const getBookings = async () => {
    try {
      const res = await api.get("/bookings/worker-bookings");
      setBookings(res.data);
    } catch (error) {
      setBookings([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put("/bookings/" + id, { status });
      getBookings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Worker Dashboard</h1>

        {worker ? (
          <div className="bg-white shadow rounded-lg p-6 mb-10">
            <h2 className="text-2xl font-bold mb-4">My Worker Profile</h2>

            <p><b>Category:</b> {worker.category}</p>
            <p><b>Skills:</b> {worker.skills}</p>
            <p><b>Experience:</b> {worker.experience} Years</p>
            <p><b>Location:</b> {worker.location}</p>
            <p><b>Price:</b> ₹{worker.pricing}</p>

            <p className="mt-3">
              <b>Status :</b>
              {worker.isApproved ? (
                <span className="text-green-600 font-bold"> Approved</span>
              ) : (
                <span className="text-yellow-600 font-bold"> Pending Approval</span>
              )}
            </p>

            <Link
              to="/edit-worker-profile"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Edit My Profile
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-8 mb-10">
            <h2 className="text-2xl font-bold mb-3">
              Create Your Worker Profile
            </h2>

            <p className="text-gray-600 mb-6">
              You have not created your worker profile yet.
            </p>

            <Link
              to="/create-worker-profile"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
            >
              Create Worker Profile
            </Link>
          </div>
        )}

        {worker && (
          <>
            <h2 className="text-3xl font-bold mb-6">Booking Requests</h2>

            {bookings.length === 0 ? (
              <div className="bg-white p-6 rounded shadow">
                No Booking Requests
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow p-6 mb-5"
                >
                  <h3 className="text-2xl font-bold">
                    {booking.user?.name}
                  </h3>

                  <p>Email : {booking.user?.email}</p>
                  <p>Date : {booking.date}</p>
                  <p>Time : {booking.time}</p>

                  {booking.problem && <p>Problem : {booking.problem}</p>}

                  <p className="mt-3">
                    Status :
                    <span className="font-bold text-orange-500">
                      {" "}
                      {booking.status}
                    </span>
                  </p>

                  {booking.status === "Pending" && (
                    <div className="mt-5 flex gap-4">
                      <button
                        onClick={() => updateStatus(booking._id, "Accepted")}
                        className="bg-green-600 text-white px-5 py-2 rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => updateStatus(booking._id, "Rejected")}
                        className="bg-red-600 text-white px-5 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {booking.status === "Accepted" && (
                    <button
                      onClick={() => updateStatus(booking._id, "Completed")}
                      className="mt-5 bg-blue-600 text-white px-5 py-2 rounded"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default WorkerDashboard;