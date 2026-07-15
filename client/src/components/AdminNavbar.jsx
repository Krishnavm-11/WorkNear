import { Link, useNavigate } from "react-router-dom";
import { FaTools } from "react-icons/fa";

function AdminNavbar() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/admin-dashboard"
          className="flex items-center gap-2"
        >
          <FaTools className="text-orange-500 text-3xl" />

          <h1 className="text-2xl font-bold">
            Work<span className="text-orange-500">Near</span>
          </h1>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6">

          <Link
            to="/admin-dashboard"
            className="hover:text-orange-500"
          >
            Dashboard
          </Link>

          <Link
            to="/worker-approval"
            className="hover:text-orange-500"
          >
            Workers
          </Link>

          <Link
            to="/admin-bookings"
            className="hover:text-orange-500"
          >
            Bookings
          </Link>

          <Link
            to="/user-view"
            className="hover:text-orange-500"
          >
            Users
          </Link>

          <Link
            to="/complaints"
            className="hover:text-orange-500"
          >
            Complaints
          </Link>

          <button
            onClick={logoutHandler}
            className="bg-orange-500 px-5 py-2 rounded-lg hover:bg-orange-600"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default AdminNavbar;