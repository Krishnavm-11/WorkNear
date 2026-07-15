import { useEffect, useState } from "react";
import { FaTrash, FaCheckCircle } from "react-icons/fa";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

function WorkerApproval() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    getWorkers();
  }, []);

  const getWorkers = async () => {
    try {
      const res = await api.get("/workers/all");
      setWorkers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveWorker = async (id) => {
    try {
      await api.put("/workers/approve/" + id);
      getWorkers();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteWorker = async (id) => {
    if (!window.confirm("Delete this worker?")) return;

    try {
      await api.delete("/admin/worker/" + id);
      getWorkers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Worker Approval
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="text-left">Category</th>
                <th className="text-left">Location</th>
                <th className="text-left">Status</th>
                <th className="text-center">Approve</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {workers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    No Workers Found
                  </td>
                </tr>
              ) : (
                workers.map((worker) => (
                  <tr
                    key={worker._id}
                    className="border-b hover:bg-orange-50"
                  >
                    <td className="p-4">
                      {worker.user?.name}
                    </td>

                    <td>{worker.category}</td>

                    <td>{worker.location}</td>

                    <td>
                      {worker.isApproved ? (
                        <span className="text-green-600 font-bold">
                          Approved
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-bold">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      {!worker.isApproved ? (
                        <button
                          onClick={() => approveWorker(worker._id)}
                          className="text-green-600 hover:text-green-800 text-xl"
                          title="Approve Worker"
                        >
                          <FaCheckCircle />
                        </button>
                      ) : (
                        <FaCheckCircle className="text-green-600 text-xl mx-auto" />
                      )}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => deleteWorker(worker._id)}
                        className="text-red-500 hover:text-red-700 text-xl"
                        title="Delete Worker"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default WorkerApproval;