
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaTools,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("credentials");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // Step 1: Check credentials and send login OTP.
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

  // Step 2: Verify OTP and complete login.
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
        showMessage("Login response is incomplete. Please try again.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      showMessage("Login successful!", "success");

      if (res.data.user.role === "worker") {
        navigate("/worker-dashboard");
      } else {
        navigate("/profile");
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

  // Resend login OTP using the same backend endpoint.
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">

        {/* WorkNear branding */}
        <div className="bg-black text-white flex flex-col justify-center items-center p-10">
          <FaTools className="text-orange-500 text-7xl mb-5" />

          <h1 className="text-4xl font-bold">
            Work
            <span className="text-orange-500">Near</span>
          </h1>

          <p className="text-gray-300 mt-5 text-center">
            Find trusted local workers near your location.
          </p>
        </div>

        {/* Login and OTP forms */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mb-5 rounded-lg border p-3 text-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {step === "credentials" ? (
            <>
              <h2 className="text-3xl font-bold text-center mb-3">
                Login
              </h2>

              <p className="text-gray-500 text-center mb-8">
                Sign in securely with email verification.
              </p>

              <form onSubmit={handleLogin}>
                <div className="flex items-center border rounded-lg mb-5 focus-within:border-orange-500">
                  <FaEnvelope className="ml-4 text-gray-500" />

                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className="w-full p-4 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center border rounded-lg mb-5 focus-within:border-orange-500">
                  <FaLock className="ml-4 text-gray-500" />

                  <input
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full p-4 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 duration-300 disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </button>
              </form>

              <p className="text-center mt-6">
                Don't have an account?

                <Link
                  to="/register"
                  className="text-orange-500 font-bold ml-2"
                >
                  Register
                </Link>
              </p>

              <p className="text-center mt-4">
                <Link
                  to="/admin-login"
                  className="text-gray-600 hover:text-orange-500"
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
                className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-7 self-start"
              >
                <FaArrowLeft />
                Back to login
              </button>

              <div className="flex justify-center mb-5">
                <div className="bg-orange-100 text-orange-500 rounded-full p-5">
                  <FaShieldAlt className="text-3xl" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center">
                Verify your email
              </h2>

              <p className="text-gray-500 text-center mt-3 mb-7">
                Enter the 6-digit code sent to
                <span className="block font-semibold text-gray-800 mt-1">
                  {email}
                </span>
              </p>

              <form onSubmit={handleVerifyOtp}>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="w-full border rounded-lg p-4 text-center text-2xl tracking-[0.5em] mb-5 focus:outline-none focus:border-orange-500"
                  required
                />

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 duration-300 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </form>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full text-orange-500 font-semibold mt-5 hover:text-orange-600 disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Resend OTP"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-5">
                The OTP expires in 5 minutes.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
