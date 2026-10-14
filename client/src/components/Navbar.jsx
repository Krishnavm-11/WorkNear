import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTools,
  FaBars,
  FaTimes,
  FaBookmark,
  FaUser,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    user = null;
  }

  const isLoggedIn = Boolean(token && user);

  // Correct paths from App.jsx
  const userDashboard = "/profile";
  const savedWorkersPage = "/saved-workers";
  const workerDashboard = "/worker-dashboard";
  const adminDashboard = "/admin-dashboard";

  const closeMenu = () => {
    setMenu(false);
    setAccountMenu(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    closeMenu();
    navigate("/login");
  };

  const openProtectedPage = (path) => {
    closeMenu();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111111] text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 transition group-hover:bg-orange-400">
            <FaTools className="text-xl text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Work<span className="text-orange-500">Near</span>
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-[2px] text-gray-400">
              Trusted local services
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <Link
            to="/"
            className="text-sm text-gray-300 transition hover:text-orange-400"
          >
            Home
          </Link>

          <Link
            to="/workers"
            className="text-sm text-gray-300 transition hover:text-orange-400"
          >
            Find Workers
          </Link>

          <Link
            to="/about"
            className="text-sm text-gray-300 transition hover:text-orange-400"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-sm text-gray-300 transition hover:text-orange-400"
          >
            Contact
          </Link>
        </div>

        {/* Desktop account area */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {/* Saved Workers bookmark */}
              {user?.role === "user" && (
                <button
                  type="button"
                  onClick={() => openProtectedPage(savedWorkersPage)}
                  title="Saved Workers"
                  aria-label="Saved Workers"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-300 transition hover:border-orange-500 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  <FaBookmark className="text-lg" />
                </button>
              )}

              {/* Account dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenu((previous) => !previous)}
                  aria-expanded={accountMenu}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 transition hover:border-orange-500"
                >
                  <FaUserCircle className="text-xl text-orange-400" />

                  <span className="max-w-28 truncate text-sm font-semibold">
                    {user?.name || "My Account"}
                  </span>

                  <FaChevronDown
                    className={`text-xs transition ${
                      accountMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountMenu && (
                  <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl bg-white py-2 text-gray-800 shadow-xl">

                    {/* Customer dashboard */}
                    {user?.role === "user" && (
                      <button
                        type="button"
                        onClick={() => openProtectedPage(userDashboard)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-orange-50 hover:text-orange-600"
                      >
                        <FaUser />
                        My Dashboard
                      </button>
                    )}

                    {/* Worker dashboard */}
                    {user?.role === "worker" && (
                      <button
                        type="button"
                        onClick={() => openProtectedPage(workerDashboard)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-orange-50 hover:text-orange-600"
                      >
                        <FaUser />
                        Worker Dashboard
                      </button>
                    )}

                    {/* Admin dashboard */}
                    {user?.role === "admin" && (
                      <button
                        type="button"
                        onClick={() => openProtectedPage(adminDashboard)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-orange-50 hover:text-orange-600"
                      >
                        <FaUser />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={logoutHandler}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-gray-300 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-400"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenu((previous) => !previous)}
          aria-label="Toggle navigation menu"
          aria-expanded={menu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xl hover:border-orange-500 lg:hidden"
        >
          {menu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile navigation */}
      {menu && (
        <div className="border-t border-white/10 bg-[#171717] px-4 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Home
            </Link>

            <Link
              to="/workers"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Find Workers
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
            >
              Contact
            </Link>

            {isLoggedIn ? (
              <>
                {/* Customer navigation */}
                {user?.role === "user" && (
                  <>
                    <button
                      type="button"
                      onClick={() => openProtectedPage(userDashboard)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
                    >
                      <FaUser />
                      My Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => openProtectedPage(savedWorkersPage)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
                    >
                      <FaBookmark />
                      Saved Workers
                    </button>
                  </>
                )}

                {/* Worker navigation */}
                {user?.role === "worker" && (
                  <button
                    type="button"
                    onClick={() => openProtectedPage(workerDashboard)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
                  >
                    <FaUser />
                    Worker Dashboard
                  </button>
                )}

                {/* Admin navigation */}
                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => openProtectedPage(adminDashboard)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-orange-400"
                  >
                    <FaUser />
                    Admin Dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={logoutHandler}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-400"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-semibold hover:border-orange-500"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-orange-500 px-4 py-3 text-center text-sm font-bold hover:bg-orange-400"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;