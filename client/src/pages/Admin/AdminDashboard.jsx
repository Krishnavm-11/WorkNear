
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaCalendarCheck,
  FaExclamationCircle,
  FaSignOutAlt,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaChartLine,
  FaBriefcase,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    users: 0,
    workers: 0,
    bookings: 0,
  });

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const [dashboardRes, workersRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/workers"),
      ]);

      setDashboard(dashboardRes.data);
      setWorkers(workersRes.data);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingWorkers = workers.filter(
    (worker) => worker.isApproved === false
  );

  const approvedWorkers = workers.filter(
    (worker) => worker.isApproved === true
  );

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
    },
    {
      name: "Worker Approval",
      path: "/worker-approval",
      icon: <FaUserTie />,
      count: pendingWorkers.length,
    },
    {
      name: "Bookings",
      path: "/admin-bookings",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Users",
      path: "/user-view",
      icon: <FaUsers />,
    },
    {
      name: "Complaints",
      path: "/complaints",
      icon: <FaExclamationCircle />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
  };

  const statCards = [
    {
      title: "Total Users",
      value: dashboard.users,
      icon: <FaUsers />,
      color: "bg-orange-50 text-orange-600",
      accent: "bg-orange-500",
      description: "Registered accounts",
    },
    {
      title: "Total Workers",
      value: dashboard.workers,
      icon: <FaUserTie />,
      color: "bg-blue-50 text-blue-600",
      accent: "bg-blue-500",
      description: "Worker profiles",
    },
    {
      title: "Total Bookings",
      value: dashboard.bookings,
      icon: <FaCalendarCheck />,
      color: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
      description: "Customer bookings",
    },
    {
      title: "Pending Workers",
      value: pendingWorkers.length,
      icon: <FaClock />,
      color: "bg-amber-50 text-amber-600",
      accent: "bg-amber-500",
      description: "Awaiting approval",
    },
    {
      title: "Approved Workers",
      value: approvedWorkers.length,
      icon: <FaCheckCircle />,
      color: "bg-purple-50 text-purple-600",
      accent: "bg-purple-500",
      description: "Approved profiles",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[265px] flex-col bg-[#151515] text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-xl font-black">
              W
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-wide">
                Work<span className="text-orange-500">Near</span>
              </h1>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400">
                Admin panel
              </p>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Admin profile */}
        <div className="mx-4 mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-lg text-orange-400">
              <FaBriefcase />
            </div>

            <div>
              <p className="font-semibold">Administrator</p>
              <p className="mt-1 text-xs text-gray-400">
                Manage WorkNear
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-5 pb-3 pt-8">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-gray-400 hover:bg-white/[0.07] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <span
                      className={`text-base ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-orange-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                  </span>

                  {item.count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-orange-500/15 text-orange-400"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => navigate("/")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 transition hover:bg-white/[0.07] hover:text-white"
          >
            <FaHome />
            Back to website
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            <FaSignOutAlt />
            Logout
          </button>

          <p className="px-4 pb-1 pt-4 text-[10px] text-gray-600">
            WORKNEAR ADMIN • V1.0
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen lg:ml-[265px]">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Open menu"
            >
              <FaBars />
            </button>

            <div>
              <p className="text-xs text-gray-500">Workspace / Overview</p>
              <h2 className="mt-1 text-lg font-bold sm:text-xl">
                Admin Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-gray-500">System management</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#151515] font-bold text-orange-400">
              A
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] p-4 sm:p-8">
          {/* Welcome section */}
          <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#171717] p-6 text-white sm:p-9">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-gray-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Administration overview
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome back, <span className="text-orange-400">Admin.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                Manage workers, monitor bookings, review customer activity,
                and keep your WorkNear platform running smoothly.
              </p>

              <button
                onClick={() => navigate("/worker-approval")}
                className="mt-6 inline-flex items-center gap-3 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Review worker requests
                <FaArrowRight />
              </button>
            </div>

            <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border-[40px] border-orange-500/10" />
            <div className="pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
            <FaChartLine className="pointer-events-none absolute bottom-8 right-12 hidden text-[150px] text-white/[0.04] md:block" />
          </section>

          {/* Stats */}
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold">Platform overview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  A quick look at your platform activity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {statCards.map((card) => (
                <div
                  key={card.title}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>

                      <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                        {loading ? "—" : card.value}
                      </h3>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg ${card.color}`}
                    >
                      {card.icon}
                    </div>
                  </div>

                  <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${card.accent}`}
                    />
                    {card.description}
                  </p>

                  <div
                    className={`absolute bottom-0 left-0 h-1 w-0 ${card.accent} transition-all duration-300 group-hover:w-full`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-xl font-bold">Quick actions</h2>
              <p className="mt-1 text-sm text-gray-500">
                Go directly to the section you want to manage
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Worker approval",
                  description: "Review and approve worker profiles",
                  icon: <FaUserTie />,
                  path: "/worker-approval",
                  color: "text-orange-600 bg-orange-50",
                },
                {
                  title: "Bookings",
                  description: "View all customer bookings",
                  icon: <FaCalendarCheck />,
                  path: "/admin-bookings",
                  color: "text-emerald-600 bg-emerald-50",
                },
                {
                  title: "Users",
                  description: "Manage registered accounts",
                  icon: <FaUsers />,
                  path: "/user-view",
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  title: "Complaints",
                  description: "Review customer complaints",
                  icon: <FaExclamationCircle />,
                  path: "/complaints",
                  color: "text-purple-600 bg-purple-50",
                },
              ].map((action) => (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${action.color}`}
                  >
                    {action.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{action.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {action.description}
                    </p>
                  </div>

                  <FaArrowRight className="shrink-0 text-sm text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                </button>
              ))}
            </div>
          </section>

          {/* Pending workers */}
          <section className="mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-lg font-bold">Pending worker requests</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Workers waiting for admin approval
                </p>
              </div>

              <button
                onClick={() => navigate("/worker-approval")}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 sm:self-auto"
              >
                View all workers
                <FaArrowRight className="text-xs" />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading worker requests...
              </div>
            ) : pendingWorkers.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
                  <FaCheckCircle />
                </div>

                <h3 className="mt-4 font-bold">You're all caught up!</h3>

                <p className="mt-2 text-sm text-gray-500">
                  There are no pending worker requests at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingWorkers.slice(0, 5).map((worker) => (
                  <div
                    key={worker._id}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-600">
                        {(worker.user?.name || "W")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold">
                          {worker.user?.name || "Worker"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {worker.category || "Service provider"}
                          {worker.location ? ` · ${worker.location}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        <FaClock />
                        Pending
                      </span>

                      <button
                        onClick={() => navigate("/worker-approval")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
                      >
                        Review
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="py-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} WorkNear. Admin workspace.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
