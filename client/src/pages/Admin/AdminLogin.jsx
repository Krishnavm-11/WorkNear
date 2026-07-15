import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAdmin = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.user.role !== "admin") {

        alert("Only Admin can Login");

        return;

      }

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/admin-dashboard");

    } catch (error) {

      alert(error.response?.data?.message);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <form
        onSubmit={loginAdmin}
        className="bg-white p-10 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">

          Admin Login

        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-3 mb-4 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-3 mb-4 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-orange-500 text-white w-full py-3 rounded-lg">

          Login

        </button>

      </form>

    </div>

  );

}

export default AdminLogin;