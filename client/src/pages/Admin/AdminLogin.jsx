
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginAdmin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      if (res.data.user?.role !== "admin") {
        setError("Access denied. This login is for administrators only.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin-dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to sign in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] p-3 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1400px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 sm:min-h-[calc(100vh-48px)] lg:grid-cols-2">
        {/* Left promotional panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#171717] p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full border-[50px] border-orange-500/10" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

          <button
            type="button"
            onClick={() => navigate("/")}
            className="relative z-10 flex w-fit items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-black">
              W
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              Work<span className="text-orange-500">Near</span>
            </span>
          </button>

          <div className="relative z-10 my-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-gray-300">
              <FaShieldAlt className="text-orange-400" />
              Administration portal
            </span>

            <h1 className="mt-8 max-w-lg text-5xl font-extrabold leading-[1.15] tracking-tight xl:text-6xl">
              Everything
              <br />
              under <span className="text-orange-500">control.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-gray-400">
              Your central workspace to manage service providers, monitor
              bookings, and maintain a trusted local services platform.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Manage worker registrations and approvals",
                "Monitor bookings and customer activity",
                "Review complaints and maintain service quality",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <FaCheckCircle className="shrink-0 text-orange-400" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-gray-500">
            <span>WORKNEAR ADMIN</span>
            <span>Secure workspace</span>
          </div>

          <FaChartLine className="pointer-events-none absolute bottom-32 right-10 text-[180px] text-white/[0.025]" />
        </section>

        {/* Right login panel */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600 lg:hidden"
            >
              <FaArrowLeft />
              Back to website
            </button>

            <div className="mb-8 lg:mb-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-600">
                <FaLock />
              </div>

              <p className="text-xs font-bold uppercase tracking-[2px] text-orange-600">
                Admin access
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Sign in with your administrator credentials to access your
                dashboard.
              </p>
            </div>

            <form onSubmit={loginAdmin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-orange-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to dashboard"}
                {!loading && (
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <FaShieldAlt className="mt-0.5 shrink-0 text-orange-500" />

              <p className="text-xs leading-5 text-gray-500">
                <span className="font-semibold text-gray-700">
                  Restricted access.
                </span>{" "}
                Only accounts with the administrator role can access the
                management dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-8 hidden items-center gap-2 text-sm text-gray-500 transition hover:text-orange-600 lg:inline-flex"
            >
              <FaArrowLeft />
              Back
            </button>

            <p className="mt-10 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} WorkNear. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminLogin;
