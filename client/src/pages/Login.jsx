import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaTools,
  FaShieldAlt,
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("credentials");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const normalizedEmail = email.trim().toLowerCase();

      const res = await api.post("/auth/login/send-otp", {
        email: normalizedEmail,
        password,
      });

      setEmail(normalizedEmail);
      setOtp("");
      setStep("otp");

      showMessage(
        res.data.message || "OTP sent to your email.",
        "success"
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to start login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      showMessage("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/auth/verify-otp", {
        email: email.trim().toLowerCase(),
        otp,
      });

      if (!res.data.token || !res.data.user) {
        showMessage(
          "Login response is incomplete. Please try again."
        );
        return;
      }

      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      showMessage("Login successful!", "success");

      // Redirect based on the logged-in user's role.
      if (user.role === "worker") {
        navigate("/worker-dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/auth/login/send-otp", {
        email: email.trim().toLowerCase(),
        password,
      });

      setOtp("");

      showMessage(
        res.data.message || "A new OTP was sent to your email.",
        "success"
      );
    } catch (error) {
      const retryAfter = error.response?.data?.retryAfter;

      showMessage(
        retryAfter
          ? `Please wait ${retryAfter} seconds before requesting another OTP.`
          : error.response?.data?.message ||
              "Could not resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0c] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="grid min-h-[650px] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#111214] shadow-2xl shadow-black/40 lg:grid-cols-2">
        {/* Branding section */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#151515] p-12 lg:flex xl:p-16">
          <div className="absolute -right-32 top-36 h-80 w-80 rounded-full border border-orange-500/20 shadow-[0_0_0_45px_rgba(249,115,22,0.03),0_0_0_90px_rgba(249,115,22,0.02)]" />

          <Link
            to="/"
            className="relative z-10 flex w-fit items-center gap-3 text-3xl font-extrabold tracking-tight"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
              <FaTools className="text-xl" />
            </span>
            Work<span className="-ml-3 text-orange-500">Near</span>
          </Link>

          <div className="relative z-10 my-14">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              LOCAL WORKERS · REAL SOLUTIONS
            </p>

            <h1 className="max-w-lg text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
              Good work.
              <br />
              <span className="text-orange-500">Right nearby.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-gray-400">
              Find trusted local professionals for your home
              and everyday needs. Simple booking, reliable
              service, and people you can count on.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Connect with local professionals",
                "Book services with confidence",
                "Secure email OTP verification",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                    <FaCheckCircle />
                  </span>
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-wide text-gray-500">
            YOUR COMMUNITY. YOUR PROFESSIONALS.
          </p>
        </section>

        {/* Login section */}
        <section className="flex items-center justify-center px-5 py-9 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-9 flex w-fit items-center gap-2 text-xl font-extrabold tracking-tight lg:hidden"
            >
              <FaTools className="text-orange-500" />
              Work<span className="-ml-2 text-orange-500">Near</span>
            </Link>

            {step === "credentials" ? (
              <>
                <div className="mb-8">
                  <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-orange-400">
                    WELCOME BACK
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Sign in to
                    <span className="text-orange-500"> WorkNear.</span>
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    Enter your account details to continue securely.
                  </p>
                </div>

                {message && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className={`mb-6 rounded-xl border p-3.5 text-sm ${
                      messageType === "success"
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-red-500/20 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Email address
                    </label>

                    <div className="flex items-center rounded-xl border border-white/10 bg-[#191a1c] transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
                      <FaEnvelope className="ml-4 shrink-0 text-sm text-gray-500" />

                      <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Password
                    </label>

                    <div className="flex items-center rounded-xl border border-white/10 bg-[#191a1c] transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
                      <FaLock className="ml-4 shrink-0 text-sm text-gray-500" />

                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full min-w-0 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="mr-4 text-gray-500 transition hover:text-orange-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending verification code..." : "Continue securely"}
                    {!loading && (
                      <FaArrowRight className="transition group-hover:translate-x-1" />
                    )}
                  </button>
                </form>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-500">
                    SECURE ACCESS
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <FaShieldAlt className="text-orange-500" />
                  Protected with email OTP verification
                </div>

                <p className="mt-7 text-center text-sm text-gray-400">
                  New to WorkNear?
                  <Link
                    to="/register"
                    className="ml-2 font-bold text-orange-500 transition hover:text-orange-400"
                  >
                    Create account
                  </Link>
                </p>

                <p className="mt-4 text-center text-sm">
                  <Link
                    to="/admin-login"
                    className="text-gray-500 transition hover:text-orange-500"
                  >
                    Admin Login
                  </Link>
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setMessage("");
                  }}
                  className="mb-8 flex items-center gap-2 text-sm text-gray-400 transition hover:text-orange-500"
                >
                  <FaArrowLeft />
                  Back to login
                </button>

                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-500">
                  <FaShieldAlt className="text-3xl" />
                </div>

                <p className="mb-3 text-xs font-bold tracking-[0.25em] text-orange-500">
                  SECOND STEP
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                  Verify your email
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Enter the 6-digit verification code sent to
                </p>

                <div className="mt-3 break-all rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm font-medium text-gray-200">
                  <FaEnvelope className="mr-2 inline text-orange-500" />
                  {email}
                </div>

                {message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-5 rounded-xl border p-3.5 text-sm ${
                      messageType === "success"
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-red-500/20 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="mt-7">
                  <label
                    htmlFor="login-otp"
                    className="mb-3 block text-sm font-medium text-gray-300"
                  >
                    Verification code
                  </label>

                  <input
                    id="login-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#191a1c] px-4 py-5 text-center text-3xl font-bold tracking-[0.6em] text-orange-400 outline-none transition placeholder:text-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    required
                  />

                  <p className="mt-3 text-xs text-gray-500">
                    The code expires in 5 minutes.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                    {!loading && <FaArrowRight />}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="mt-5 w-full rounded-lg py-2 text-sm font-semibold text-orange-500 transition hover:text-orange-400 disabled:opacity-50"
                >
                  {loading
                    ? "Please wait..."
                    : "Didn't receive the code? Resend OTP"}
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;