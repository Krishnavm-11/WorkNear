import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EditWorkerProfile() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [pricing, setPricing] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    getWorkerProfile();
  }, []);

  const getWorkerProfile = async () => {
    try {
      const res = await api.get("/workers/my-profile");

      setCategory(res.data.category);
      setSkills(res.data.skills);
      setExperience(res.data.experience);
      setPricing(res.data.pricing);
      setLocation(res.data.location);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("category", category);
    formData.append("skills", skills);
    formData.append("experience", experience);
    formData.append("pricing", pricing);
    formData.append("location", location);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      await api.put("/workers/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile Updated Successfully");
      navigate("/worker-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Edit Worker Profile
        </h1>

        <form onSubmit={updateProfile}>
          <input
            type="text"
            placeholder="Category"
            className="w-full border p-3 rounded mb-4"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="text"
            placeholder="Skills"
            className="w-full border p-3 rounded mb-4"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <input
            type="number"
            placeholder="Experience"
            className="w-full border p-3 rounded mb-4"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          <input
            type="number"
            placeholder="Pricing"
            className="w-full border p-3 rounded mb-4"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full border p-3 rounded mb-4"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label className="block mb-2 font-semibold">
            Change Profile Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full border p-3 rounded mb-6"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditWorkerProfile;