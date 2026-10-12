
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaTools,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // Step 1: Send registration OTP.
  const registerUser = async (e) => {
    e.preventDefault();
    setMessage("");

    if (name.trim().length < 2) {
      showMessage("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register/send-otp", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      // Only switch to OTP screen after backend success.
      setStep("otp");
      setCountdown(60);
      setOtp("");

      showMessage(
        response.data.message || "Verification email sent.",
        "success"
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Could not send the verification email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and create the account.
  const verifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      showMessage("Enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register/verify-otp", {
        email: email.trim().toLowerCase(),
        otp,
      });

      // Show success only after the server verifies the OTP.
      showMessage(
        response.data.message || "Registration successful!",
        "success"
      );

      setStep("success");
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP after the cooldown.
  const resendOtp = async () => {
    if (countdown > 0 || resending) return;

    setMessage("");

    try {
      setResending(true);

      const response = await api.post("/auth/register/resend-otp", {
        email: email.trim().toLowerCase(),
      });

      setOtp("");
      setCountdown(60);

      showMessage(
        response.data.message || "A new verification code was sent.",
        "success"
      );
    } catch (error) {
      const retryAfter = error.response?.data?.retryAfter;

      if (retryAfter) setCountdown(retryAfter);

      showMessage(
        error.response?.data?.message ||
          "Could not resend the verification code."
      );
    } finally {
      setResending(false);
    }
  };

  const messageClass =
    messageType === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className="min-h-screen bg-[#f5f3ef] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_24px_80px_rgba(25,20,15,0.10)] lg:grid-cols-2">

          {/* Branding panel */}
          <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-[#171715] p-8 text-white sm:p-12 lg:min-h-[680px]">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-orange-400/20" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                <FaTools className="text-xl" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">WorkNear</h1>
                <p className="text-xs tracking-[0.18em] text-white/50">
                  LOCAL HELP. MADE SIMPLE.
                </p>
              </div>
            </div>

            <div className="relative z-10 my-10 lg:my-0">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
                Your neighbourhood, connected
              </p>

              <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Great work starts
                <span className="text-orange-400"> close to home.</span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-white/60">
                Find trusted local professionals or share your skills with
                people who need your help.
              </p>
            </div>

            <p className="relative z-10 text-xs text-white/35">
              Connecting people. Supporting local skills.
            </p>
          </div>

          {/* Registration panel */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">

              {step === "register" && (
                <>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                    Get started
                  </p>

                  <h2 className="text-3xl font-semibold tracking-tight text-[#20201e] sm:text-4xl">
                    Create your account
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Join WorkNear and connect with your local community.
                  </p>

                  {message && (
                    <div
                      role="alert"
                      className={`mt-6 rounded-xl border px-4 py-3 text-sm ${messageClass}`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={registerUser} className="mt-7 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Full name
                      </label>

                      <div className="flex items-center rounded-xl border border-gray-200 bg-[#fafaf9] focus-within:border-orange-400">
                        <FaUser className="ml-4 text-sm text-gray-400" />
                        <input
                          type="text"
                          autoComplete="name"
                          placeholder="Enter your full name"
                          maxLength={80}
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email address
                      </label>

                      <div className="flex items-center rounded-xl border border-gray-200 bg-[#fafaf9] focus-within:border-orange-400">
                        <FaEnvelope className="ml-4 text-sm text-gray-400" />
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Password
                      </label>

                      <div className="flex items-center rounded-xl border border-gray-200 bg-[#fafaf9] focus-within:border-orange-400">
                        <FaLock className="ml-4 text-sm text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="At least 6 characters"
                          minLength={6}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="mr-4 text-gray-400"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        I want to join as
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRole("user")}
                          className={`rounded-xl border p-4 text-left transition ${
                            role === "user"
                              ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <FaUser className="mb-2 text-orange-600" />
                          <span className="block text-sm font-semibold text-gray-800">
                            Customer
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            Find local help
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole("worker")}
                          className={`rounded-xl border p-4 text-left transition ${
                            role === "worker"
                              ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <FaTools className="mb-2 text-orange-600" />
                          <span className="block text-sm font-semibold text-gray-800">
                            Worker
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            Offer your skills
                          </span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-60"
                    >
                      {loading ? "Sending verification code..." : "Create account"}
                      {!loading && <span>→</span>}
                    </button>
                  </form>

                  <p className="mt-7 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-orange-600 hover:text-orange-700"
                    >
                      Log in
                    </Link>
                  </p>
                </>
              )}

              {step === "otp" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("register");
                      setOtp("");
                      setMessage("");
                    }}
                    className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <FaArrowLeft />
                    Back to registration
                  </button>

                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <FaShieldAlt className="text-2xl" />
                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight text-[#20201e]">
                    Check your email
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Enter the 6-digit code sent to{" "}
                    <strong className="text-gray-800">{email}</strong>.
                    The code expires in 5 minutes.
                  </p>

                  {message && (
                    <div
                      role={messageType === "success" ? "status" : "alert"}
                      className={`mt-6 rounded-xl border px-4 py-3 text-sm ${messageClass}`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={verifyOtp} className="mt-8">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Verification code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-[#fafaf9] px-4 py-5 text-center text-3xl font-semibold tracking-[0.5em] text-gray-900 outline-none focus:border-orange-400"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-5 w-full rounded-xl bg-orange-500 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify email"}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={countdown > 0 || resending}
                      className="font-semibold text-orange-600 hover:text-orange-700 disabled:text-gray-400"
                    >
                      {resending
                        ? "Sending..."
                        : countdown > 0
                          ? `Resend in ${countdown}s`
                          : "Resend code"}
                    </button>
                  </div>

                  <p className="mt-6 text-center text-xs leading-5 text-gray-400">
                    <FaShieldAlt className="mr-1 inline" />
                    Never share your verification code with anyone.
                  </p>
                </>
              )}

              {step === "success" && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <FaCheckCircle className="text-4xl" />
                  </div>

                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
                    Email verified
                  </p>

                  <h2 className="text-3xl font-semibold tracking-tight text-[#20201e]">
                    Registration successful!
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Your WorkNear account has been created successfully.
                    You can now log in with your email and password.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-8 w-full rounded-xl bg-orange-500 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                  >
                    Continue to login →
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
