import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

function UserView() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete("/admin/user/" + id);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-8">
          User Management
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    No Users Found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-orange-50"
                  >
                    <td className="p-4">{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          user.role === "admin"
                            ? "bg-red-500"
                            : user.role === "worker"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="text-center">
                      {user.role !== "admin" ? (
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 text-xl"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
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

export default UserView;