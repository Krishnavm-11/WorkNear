import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");

  useEffect(() => {
    getWorker();
  }, []);

  const getWorker = async () => {
    try {
      const res = await api.get("/workers/" + id);
      setWorker(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const bookWorker = async (e) => {
    e.preventDefault();

    try {
      await api.post("/bookings", {
        worker: id,
        date,
        time,
        problem,
      });

      alert("Booking Successful");

      navigate("/profile");

    } catch (error) {
      console.log(error);
      alert("Booking Failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Book Worker
        </h1>

        <div className="mb-8">

          <h2 className="text-2xl font-bold">
            {worker.user?.name}
          </h2>

          <p className="text-orange-500">
            {worker.category}
          </p>

          <p>📍 {worker.location}</p>

          <p>💰 ₹{worker.pricing}</p>

        </div>

        <form onSubmit={bookWorker}>

          <label className="font-semibold">
            Booking Date
          </label>

          <input
            type="date"
            className="w-full border p-3 rounded-lg mt-2 mb-5"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label className="font-semibold">
            Booking Time
          </label>

          <input
            type="time"
            className="w-full border p-3 rounded-lg mt-2 mb-5"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <label className="font-semibold">
            Describe Your Problem
          </label>

          <textarea
            rows="4"
            className="w-full border p-3 rounded-lg mt-2 mb-5"
            placeholder="Describe your work..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          ></textarea>

          <button
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
          >
            Confirm Booking
          </button>

        </form>

      </div>

    </div>
  );
}

export default Booking;