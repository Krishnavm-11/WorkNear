import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateWorkerProfile() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [pricing, setPricing] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("category", category);
    formData.append("skills", skills);
    formData.append("experience", experience);
    formData.append("pricing", pricing);
    formData.append("location", location);
    formData.append("profileImage", profileImage);

    try {
      await api.post("/workers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile Submitted Successfully");
      navigate("/worker-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create Worker Profile
        </h1>

        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Category"
            className="w-full border p-3 rounded mb-4"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Skills"
            className="w-full border p-3 rounded mb-4"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Experience"
            className="w-full border p-3 rounded mb-4"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Pricing"
            className="w-full border p-3 rounded mb-4"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full border p-3 rounded mb-4"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            className="w-full border p-3 rounded mb-6"
            onChange={(e) => setProfileImage(e.target.files[0])}
            required
          />

          <button className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600">
            Submit For Approval
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkerProfile;