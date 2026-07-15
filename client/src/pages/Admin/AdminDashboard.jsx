import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    users: 0,
    workers: 0,
    bookings: 0,
  });

  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const dashboardRes = await api.get("/admin/dashboard");
      const workersRes = await api.get("/admin/workers");

      setDashboard(dashboardRes.data);
      setWorkers(workersRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const pendingWorkers = workers.filter(
    (worker) => worker.isApproved === false
  );

  const approvedWorkers = workers.filter(
    (worker) => worker.isApproved === true
  );

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          Manage users, workers, bookings and complaints.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-orange-500 text-white rounded-xl p-6 shadow">
            <h2>Total Users</h2>
            <h1 className="text-4xl font-bold mt-3">
              {dashboard.users}
            </h1>
          </div>

          <div className="bg-black text-white rounded-xl p-6 shadow">
            <h2>Total Workers</h2>
            <h1 className="text-4xl font-bold mt-3">
              {dashboard.workers}
            </h1>
          </div>

          <div className="bg-green-500 text-white rounded-xl p-6 shadow">
            <h2>Total Bookings</h2>
            <h1 className="text-4xl font-bold mt-3">
              {dashboard.bookings}
            </h1>
          </div>

          <div className="bg-yellow-500 text-white rounded-xl p-6 shadow">
            <h2>Pending Workers</h2>
            <h1 className="text-4xl font-bold mt-3">
              {pendingWorkers.length}
            </h1>
          </div>

          <div className="bg-blue-500 text-white rounded-xl p-6 shadow">
            <h2>Approved Workers</h2>
            <h1 className="text-4xl font-bold mt-3">
              {approvedWorkers.length}
            </h1>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => navigate("/worker-approval")}
            className="bg-white p-6 rounded-xl shadow hover:bg-orange-500 hover:text-white"
          >
            Worker Approval
          </button>

          <button
            onClick={() => navigate("/admin-bookings")}
            className="bg-white p-6 rounded-xl shadow hover:bg-orange-500 hover:text-white"
          >
            Bookings
          </button>

          <button
            onClick={() => navigate("/user-view")}
            className="bg-white p-6 rounded-xl shadow hover:bg-orange-500 hover:text-white"
          >
            Users
          </button>

          <button
            onClick={() => navigate("/complaints")}
            className="bg-white p-6 rounded-xl shadow hover:bg-orange-500 hover:text-white"
          >
            Complaints
          </button>
        </div>

        <div className="bg-white rounded-xl shadow mt-12 p-6">
          <h2 className="text-2xl font-bold mb-5">
            Pending Worker Requests
          </h2>

          {pendingWorkers.length === 0 ? (
            <p className="text-gray-500">
              No pending worker requests.
            </p>
          ) : (
            pendingWorkers.slice(0, 5).map((worker) => (
              <div
                key={worker._id}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <h3 className="font-bold">
                    {worker.user?.name}
                  </h3>

                  <p className="text-gray-600">
                    {worker.category} - {worker.location}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/worker-approval")}
                  className="bg-orange-500 text-white px-5 py-2 rounded"
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;