import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterComplaint() {
  const { workerId, bookingId } = useParams();

  const navigate = useNavigate();

  const [complaint, setComplaint] = useState("");

  const submitComplaint = async (e) => {
    e.preventDefault();

    try {
      await api.post("/complaints", {
        worker: workerId,
        booking: bookingId,
        complaint: complaint,
      });

      alert("Complaint Submitted Successfully");

      navigate("/profile");

    } catch (error) {
      alert(error.response?.data?.message || "Complaint Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6">
          Register Complaint
        </h1>

        <form onSubmit={submitComplaint}>
          <label className="font-semibold">
            Complaint
          </label>

          <textarea
            rows="6"
            className="w-full border p-3 rounded-lg mt-2 mb-5"
            placeholder="Write your complaint here..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          ></textarea>

          <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterComplaint;