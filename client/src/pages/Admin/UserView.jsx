
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaTrash,
  FaUsers,
  FaUserShield,
  FaHardHat,
  FaUser,
  FaEnvelope,
  FaSyncAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaUserCog,
} from "react-icons/fa";

import api from "../../services/api";

function UserView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load users. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const stats = useMemo(
    () => ({
      total: users.length,
      customers: users.filter((user) => user.role === "user").length,
      workers: users.filter((user) => user.role === "worker").length,
      admins: users.filter((user) => user.role === "admin").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const deleteUser = async () => {
    if (!deleteTarget || deleting) return;

    const target = deleteTarget;

    try {
      setDeleting(true);
      setMessage("");

      await api.delete("/admin/user/" + target._id);

      setUsers((previous) =>
        previous.filter((user) => user._id !== target._id)
      );

      setDeleteTarget(null);
      setMessage(`${target.name || "User"} was deleted successfully.`);
      setMessageType("success");
    } catch (error) {
      console.error("Error deleting user:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to delete this user. Please try again."
      );
      setMessageType("error");
    } finally {
      setDeleting(false);
    }
  };

  const roleStyles = (role) => {
    if (role === "admin") {
      return {
        badge: "bg-violet-50 text-violet-700 ring-violet-200",
        icon: <FaUserShield />,
        label: "Admin",
      };
    }

    if (role === "worker") {
      return {
        badge: "bg-orange-50 text-orange-700 ring-orange-200",
        icon: <FaHardHat />,
        label: "Worker",
      };
    }

    return {
      badge: "bg-sky-50 text-sky-700 ring-sky-200",
      icon: <FaUser />,
      label: "Customer",
    };
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Premium header */}
        <section className="relative overflow-hidden rounded-3xl bg-[#171717] p-6 text-white shadow-xl shadow-black/5 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-orange-300">
                <FaUserCog />
                ADMINISTRATION
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                User
                <span className="text-orange-400"> management.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base">
                Manage WorkNear accounts, review user roles, and keep
                your local service community organized.
              </p>
            </div>

            <button
              type="button"
              onClick={getUsers}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-400/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh users
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total accounts"
            value={stats.total}
            icon={<FaUsers />}
            detail="All registered accounts"
            iconStyle="bg-neutral-100 text-neutral-700"
          />

          <StatCard
            title="Customers"
            value={stats.customers}
            icon={<FaUser />}
            detail="Service seekers"
            iconStyle="bg-sky-50 text-sky-600"
          />

          <StatCard
            title="Workers"
            value={stats.workers}
            icon={<FaHardHat />}
            detail="Service professionals"
            iconStyle="bg-orange-50 text-orange-600"
          />

          <StatCard
            title="Administrators"
            value={stats.admins}
            icon={<FaUserShield />}
            detail="Admin accounts"
            iconStyle="bg-violet-50 text-violet-600"
          />
        </section>

        {/* Status message */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-6 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <FaCheckCircle className="mt-0.5 shrink-0" />
            ) : (
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
            )}

            <p className="flex-1">{message}</p>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              className="shrink-0 opacity-70 hover:opacity-100"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Directory */}
        <section className="mt-9">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                Account directory
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Registered users
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "account" : "accounts"}{" "}
                found
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
              <div className="relative min-w-0 flex-1">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email or phone..."
                  aria-label="Search users"
                  className="w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-11 pr-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by role"
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="All">All roles</option>
                <option value="user">Customers</option>
                <option value="worker">Workers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Account list
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Account information and access roles
                </p>
              </div>

              <span className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
                {filteredUsers.length} records
              </span>
            </div>

            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center gap-4"
                  >
                    <div className="h-11 w-11 rounded-xl bg-neutral-200" />
                    <div className="flex-1">
                      <div className="h-4 w-36 rounded bg-neutral-200" />
                      <div className="mt-2 h-3 w-48 max-w-full rounded bg-neutral-100" />
                    </div>
                    <div className="h-7 w-20 rounded-full bg-neutral-100" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-xl text-orange-500">
                  <FaUsers />
                </div>

                <h3 className="mt-4 text-base font-bold text-neutral-900">
                  {users.length === 0
                    ? "No users registered"
                    : "No matching accounts"}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  {users.length === 0
                    ? "Registered accounts will appear here."
                    : "Try changing your search or role filter."}
                </p>

                {(search || roleFilter !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setRoleFilter("All");
                    }}
                    className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-[#fafaf9]">
                      <tr className="border-b border-neutral-200">
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                          User
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                          Contact
                        </th>

                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                          Role
                        </th>

                        <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                      {filteredUsers.map((user) => {
                        const style = roleStyles(user.role);

                        return (
                          <tr
                            key={user._id}
                            className="transition hover:bg-orange-50/40"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={user.name} role={user.role} />

                                <div className="min-w-0">
                                  <p className="max-w-[230px] truncate text-sm font-bold text-neutral-900">
                                    {user.name || "Unnamed user"}
                                  </p>

                                  <p className="mt-1 text-xs text-neutral-400">
                                    ID: {String(user._id).slice(-8)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex max-w-[260px] items-center gap-2 text-sm text-neutral-600">
                                <FaEnvelope className="shrink-0 text-xs text-neutral-400" />
                                <span className="truncate">
                                  {user.email || "No email"}
                                </span>
                              </div>

                              {user.phone && (
                                <p className="mt-1.5 pl-5 text-xs text-neutral-500">
                                  {user.phone}
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${style.badge}`}
                              >
                                {style.icon}
                                {style.label}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              {user.role !== "admin" ? (
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(user)}
                                  aria-label={`Delete ${user.name || "user"}`}
                                  title="Delete user"
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/10"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              ) : (
                                <span className="text-xs font-medium text-neutral-400">
                                  Protected
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                  {filteredUsers.map((user) => {
                    const style = roleStyles(user.role);

                    return (
                      <article
                        key={user._id}
                        className="rounded-xl border border-neutral-200 bg-white p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar name={user.name} role={user.role} />

                          <div className="min-w-0 flex-1">
                            <h3 className="break-words text-sm font-bold text-neutral-900">
                              {user.name || "Unnamed user"}
                            </h3>

                            <p className="mt-1 break-all text-xs leading-5 text-neutral-500">
                              {user.email || "No email"}
                            </p>

                            {user.phone && (
                              <p className="mt-1 break-words text-xs text-neutral-500">
                                {user.phone}
                              </p>
                            )}

                            <span
                              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${style.badge}`}
                            >
                              {style.icon}
                              {style.label}
                            </span>
                          </div>

                          {user.role !== "admin" && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(user)}
                              aria-label={`Delete ${user.name || "user"}`}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        <p className="mt-9 text-center text-xs text-neutral-400">
          WorkNear <span className="mx-1.5">·</span>
          Account administration
        </p>
      </div>

      {/* In-page delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
              <FaExclamationTriangle />
            </div>

            <h2
              id="delete-user-title"
              className="mt-5 text-xl font-bold text-neutral-900"
            >
              Delete this account?
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              You are about to delete{" "}
              <span className="font-semibold text-neutral-800">
                {deleteTarget.name || "this user"}
              </span>
              . This action may be permanent and could affect related
              worker profiles or bookings.
            </p>

            <div className="mt-4 rounded-xl bg-neutral-50 p-3">
              <p className="break-all text-sm font-semibold text-neutral-800">
                {deleteTarget.email}
              </p>
              <p className="mt-1 text-xs capitalize text-neutral-500">
                Role: {deleteTarget.role}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteUser}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <FaSyncAlt className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Delete account
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, icon, detail, iconStyle }) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-neutral-500">{detail}</p>
    </div>
  );
}

function Avatar({ name, role }) {
  const initials = (name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const avatarStyle =
    role === "admin"
      ? "bg-violet-50 text-violet-700"
      : role === "worker"
        ? "bg-orange-50 text-orange-600"
        : "bg-neutral-100 text-neutral-700";

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${avatarStyle}`}
    >
      {initials || "U"}
    </div>
  );
}

export default UserView;
