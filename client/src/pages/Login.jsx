import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaTools } from "react-icons/fa";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.user.role === "admin") {
        alert("Please use Admin Login");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "worker") {

        navigate("/worker-dashboard");

      } else {

        navigate("/profile");

      }

    } catch (error) {

      alert(error.response?.data?.message || "Login Failed");

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">

        <div className="bg-black text-white flex flex-col justify-center items-center p-10">

          <FaTools className="text-orange-500 text-7xl mb-5" />

          <h1 className="text-4xl font-bold">

            Work<span className="text-orange-500">Near</span>

          </h1>

          <p className="text-gray-300 mt-5 text-center">

            Find trusted local workers near your location.

          </p>

        </div>

        <div className="p-10">

          <h2 className="text-3xl font-bold text-center mb-8">

            Login

          </h2>

          <form onSubmit={loginUser}>

            <div className="flex items-center border rounded-lg mb-5">

              <FaEnvelope className="ml-4 text-gray-500" />

              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            <div className="flex items-center border rounded-lg mb-5">

              <FaLock className="ml-4 text-gray-500" />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 duration-300"
            >

              Login

            </button>

          </form>

          <p className="text-center mt-6">

            Don't have an account?

            <Link
              to="/register"
              className="text-orange-500 font-bold ml-2"
            >

              Register

            </Link>

          </p>

          <p className="text-center mt-4">

            <Link
              to="/admin-login"
              className="text-gray-600 hover:text-orange-500"
            >

              Admin Login

            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Login;