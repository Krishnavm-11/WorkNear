import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

function ComplaintView() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getComplaints();
  }, []);

  const getComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await api.put("/complaints/" + id);
      getComplaints();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-2">
          Customer Complaints
        </h1>

        <p className="text-gray-600 mb-8">
          View and resolve customer complaints.
        </p>

        {complaints.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow">
            No Complaints Found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold">
                  {item.user?.name}
                </h2>

                <p className="text-orange-500 font-semibold mt-1">
                  {item.worker?.category}
                </p>

                <p className="mt-4">
                  <b>Complaint:</b> {item.complaint}
                </p>

                <div className="mt-5">
                  <span
                    className={`px-4 py-2 rounded-full text-white font-semibold ${item.status === "Resolved"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                      }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.status === "Pending" ? (
                  <button
                    onClick={() => resolveComplaint(item._id)}
                    className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                  >
                    Mark as Resolved
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full mt-6 bg-gray-300 text-gray-600 py-3 rounded-lg"
                  >
                    Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ComplaintView;