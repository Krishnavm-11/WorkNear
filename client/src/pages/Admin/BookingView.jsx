import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

function BookingView() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const res = await api.get("/admin/bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-2">
          Booking Management
        </h1>

        <p className="text-gray-600 mb-8">
          View and track all customer bookings.
        </p>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow">
            No Bookings Found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-4">
                  {booking.worker?.category}
                </h2>

                <p>
                  <b>Customer:</b> {booking.user?.name}
                </p>

                <p>
                  <b>Worker:</b> {booking.worker?.user?.name || "Worker"}
                </p>

                <p>
                  <b>Date:</b> {booking.date}
                </p>

                <p>
                  <b>Time:</b> {booking.time}
                </p>

                {booking.problem && (
                  <p>
                    <b>Problem:</b> {booking.problem}
                  </p>
                )}

                <div className="mt-5">
                  <span
                    className={`px-4 py-2 rounded-full text-white font-semibold ${
                      booking.status === "Completed"
                        ? "bg-green-500"
                        : booking.status === "Pending"
                        ? "bg-yellow-500"
                        : booking.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default BookingView;