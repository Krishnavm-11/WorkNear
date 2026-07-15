import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTools, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <FaTools className="text-orange-500 text-3xl" />
          <h1 className="text-2xl font-bold">
            Work<span className="text-orange-500">Near</span>
          </h1>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <Link to="/workers" className="hover:text-orange-500">Workers</Link>
          <Link to="/about" className="hover:text-orange-500">About</Link>
          <Link to="/contact" className="hover:text-orange-500">Contact</Link>

          {token ? (
            <>
              {user?.role === "worker" && (
                <Link to="/worker-dashboard" className="hover:text-orange-500">
                  Worker Dashboard
                </Link>
              )}

              {user?.role === "user" && (
                <Link to="/profile" className="hover:text-orange-500">
                  Profile
                </Link>
              )}

              <button
                onClick={logoutHandler}
                className="bg-orange-500 px-5 py-2 rounded hover:bg-orange-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-500">Login</Link>
              <Link
                to="/register"
                className="bg-orange-500 px-5 py-2 rounded hover:bg-orange-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {menu && (
        <div className="md:hidden bg-gray-900 flex flex-col px-6 pb-5">
          <Link to="/" className="py-3" onClick={() => setMenu(false)}>Home</Link>
          <Link to="/workers" className="py-3" onClick={() => setMenu(false)}>Workers</Link>
          <Link to="/about" className="py-3" onClick={() => setMenu(false)}>About</Link>
          <Link to="/contact" className="py-3" onClick={() => setMenu(false)}>Contact</Link>

          {token ? (
            <>
              {user?.role === "worker" && (
                <Link
                  to="/worker-dashboard"
                  className="py-3"
                  onClick={() => setMenu(false)}
                >
                  Worker Dashboard
                </Link>
              )}

              {user?.role === "user" && (
                <Link
                  to="/profile"
                  className="py-3"
                  onClick={() => setMenu(false)}
                >
                  Profile
                </Link>
              )}

              <button
                onClick={logoutHandler}
                className="bg-orange-500 py-2 rounded mt-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-3" onClick={() => setMenu(false)}>Login</Link>
              <Link to="/register" className="py-3" onClick={() => setMenu(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;