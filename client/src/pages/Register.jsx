import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaTools } from "react-icons/fa";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">

        <div className="bg-orange-500 text-white flex flex-col justify-center items-center p-10">

          <FaTools className="text-7xl mb-6" />

          <h1 className="text-4xl font-bold">

            WorkNear

          </h1>

          <p className="mt-5 text-center">

            Create your account and connect with trusted local workers.

          </p>

        </div>

        <div className="p-10">

          <h2 className="text-3xl font-bold text-center mb-8">

            Register

          </h2>

          <form onSubmit={registerUser}>

            <div className="flex items-center border rounded-lg mb-5">

              <FaUser className="ml-4 text-gray-500" />

              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>

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

            <select className="w-full border rounded-lg p-4 mb-5 outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >

              <option value="user">

                User

              </option>

              <option value="worker">

                Worker

              </option>

            </select>

            <button className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 duration-300 hover:scale-105">

              Register

            </button>

          </form>

          <p className="text-center mt-6">

            Already have an account?

            <Link to="/login" className="text-orange-500 font-bold ml-2">

              Login

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;