import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function UserProfile() {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const res = await api.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const total = bookings.length;

  const pending = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">
          Welcome {user?.name} 👋
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">
            My Profile
          </h2>

          <p><b>Name :</b> {user?.name}</p>
          <p><b>Email :</b> {user?.email}</p>
          <p><b>Role :</b> {user?.role}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-orange-500 text-white rounded-xl p-6 shadow-lg">
            <h2>Total Bookings</h2>
            <h1 className="text-4xl font-bold">{total}</h1>
          </div>

          <div className="bg-yellow-500 text-white rounded-xl p-6 shadow-lg">
            <h2>Pending</h2>
            <h1 className="text-4xl font-bold">{pending}</h1>
          </div>

          <div className="bg-green-500 text-white rounded-xl p-6 shadow-lg">
            <h2>Completed</h2>
            <h1 className="text-4xl font-bold">{completed}</h1>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">
          My Bookings
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            No Bookings Found
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-lg p-6 mb-5"
            >
              <h2 className="text-2xl font-bold">
                {booking.worker?.category || "Worker Not Available"}
              </h2>

              <p className="mt-3">📅 {booking.date}</p>
              <p>⏰ {booking.time}</p>

              {booking.problem && (
                <p className="mt-2">📝 {booking.problem}</p>
              )}

              <p className="mt-3">
                Status :
                <span className="text-orange-500 font-bold">
                  {" "}
                  {booking.status}
                </span>
              </p>

              {booking.worker ? (
                <div className="mt-5 flex gap-3 flex-wrap">
                  {booking.status === "Completed" && (
                    <Link
                      to={
                        "/review/" +
                        booking.worker._id +
                        "/" +
                        booking._id
                      }
                      className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Give Review
                    </Link>
                  )}

                  <Link
                    to={
                      "/register-complaint/" +
                      booking.worker._id +
                      "/" +
                      booking._id
                    }
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                  >
                    Register Complaint
                  </Link>
                </div>
              ) : (
                <p className="mt-5 text-red-500 font-semibold">
                  Worker was deleted or not available.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;