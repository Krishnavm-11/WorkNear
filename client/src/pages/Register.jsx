
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTools,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaUserTie,
  FaShieldAlt,
  FaPhone,
} from "react-icons/fa";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 1: Send registration OTP
  const handleRegister = async (e) => {
    e.preventDefault();

    const normalizedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedPhone = formData.phone.trim();

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      showMessage("Name must contain between 2 and 80 characters.");
      return;
    }

    if (formData.password.length < 6) {
      showMessage("Password must contain at least 6 characters.");
      return;
    }

    // A phone number is required for worker registration
    if (formData.role === "worker") {
      const phoneDigits = normalizedPhone.replace(/\D/g, "");

      if (
        !/^\+?[0-9\s()-]+$/.test(normalizedPhone) ||
        phoneDigits.length < 10 ||
        phoneDigits.length > 15
      ) {
        showMessage("Please enter a valid worker phone number.");
        return;
      }
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/auth/register/send-otp", {
        name: normalizedName,
        email: normalizedEmail,
        password: formData.password,
        role: formData.role,
        phone: formData.role === "worker" ? normalizedPhone : "",
      });

      setFormData((prev) => ({
        ...prev,
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
      }));

      setOtp("");
      setStep("otp");

      showMessage(
        res.data.message || "Verification code sent to your email.",
        "success"
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to start registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      showMessage("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/auth/register/verify-otp", {
        email: formData.email.trim().toLowerCase(),
        otp,
      });

      // If the backend automatically logs in the new user
      if (res.data.token && res.data.user) {
        const user = res.data.user;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        showMessage("Account created successfully!", "success");

        if (user.role === "worker") {
          navigate("/worker-dashboard", { replace: true });
        } else if (user.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/profile", { replace: true });
        }

        return;
      }

      // Existing backend verifies registration without logging in
      showMessage(
        res.data.message ||
          "Registration verified. Please log in to continue.",
        "success"
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend registration OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/auth/register/send-otp", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        phone: formData.role === "worker" ? formData.phone.trim() : "",
      });

      setOtp("");

      showMessage(
        res.data.message || "A new verification code was sent.",
        "success"
      );
    } catch (error) {
      const retryAfter = error.response?.data?.retryAfter;

      showMessage(
        retryAfter
          ? `Please wait ${retryAfter} seconds before requesting another code.`
          : error.response?.data?.message ||
              "Could not resend the verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const goBackToRegistration = () => {
    setStep("register");
    setOtp("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#f4f2ed] px-4 py-8 text-gray-900 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/10 lg:min-h-[720px] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Branding panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#171717] p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-28 top-28 h-80 w-80 rounded-full border border-orange-500/20 shadow-[0_0_0_45px_rgba(249,115,22,0.04),0_0_0_90px_rgba(249,115,22,0.025)]" />

          <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

          <Link to="/" className="relative z-10 flex w-fit items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-xl shadow-lg shadow-orange-500/20">
              <FaTools />
            </span>

            <span className="text-3xl font-extrabold tracking-tight">
              Work<span className="text-orange-500">Near</span>
            </span>
          </Link>

          <div className="relative z-10 my-12">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
              JOIN OUR COMMUNITY
            </p>

            <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
              Better services.
              <br />
              <span className="text-orange-500">Closer to home.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-gray-400">
              Create your WorkNear account and make finding reliable local
              professionals easier than ever.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Discover trusted local professionals",
                "Manage your service bookings",
                "Stay protected with email verification",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                    <FaCheckCircle />
                  </span>
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-5">
            <p className="text-xs tracking-widest text-gray-500">
              YOUR COMMUNITY. YOUR PROFESSIONALS.
            </p>
          </div>
        </section>

        {/* Registration and OTP forms */}
        <section className="flex items-center justify-center px-5 py-9 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-8 flex w-fit items-center gap-2 text-2xl font-extrabold lg:hidden"
            >
              <FaTools className="text-orange-500" />
              Work<span className="-ml-2 text-orange-500">Near</span>
            </Link>

            {step === "register" ? (
              <>
                <div className="mb-7">
                  <span className="mb-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-orange-600">
                    CREATE YOUR ACCOUNT
                  </span>

                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Let's get you
                    <span className="text-orange-500"> started.</span>
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Enter your details to join the WorkNear community.
                  </p>
                </div>

                {message && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className={`mb-5 rounded-xl border p-3.5 text-sm ${
                      messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Full name */}
                  <div>
                    <label
                      htmlFor="register-name"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Full name
                    </label>

                    <div className="flex items-center rounded-xl border border-gray-200 bg-[#faf9f6] transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10">
                      <FaUser className="ml-4 shrink-0 text-sm text-gray-400" />
                      <input
                        id="register-name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-gray-400"
                        required
                        minLength={2}
                        maxLength={80}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Email address
                    </label>

                    <div className="flex items-center rounded-xl border border-gray-200 bg-[#faf9f6] transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10">
                      <FaEnvelope className="ml-4 shrink-0 text-sm text-gray-400" />
                      <input
                        id="register-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone: workers only */}
                  {formData.role === "worker" && (
                    <div>
                      <label
                        htmlFor="register-phone"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Phone number
                      </label>

                      <div className="flex items-center rounded-xl border border-gray-200 bg-[#faf9f6] transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10">
                        <FaPhone className="ml-4 shrink-0 text-sm text-gray-400" />
                        <input
                          id="register-phone"
                          type="tel"
                          name="phone"
                          placeholder="Enter your phone number"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-gray-400"
                          required
                          pattern="[+]?[0-9\s()-]{10,18}"
                          title="Enter a valid phone number"
                        />
                      </div>

                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        Customers can contact you after you accept their booking.
                      </p>
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Create password
                    </label>

                    <div className="flex items-center rounded-xl border border-gray-200 bg-[#faf9f6] transition focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-500/10">
                      <FaLock className="ml-4 shrink-0 text-sm text-gray-400" />
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full min-w-0 bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-gray-400"
                        required
                        minLength={6}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="mr-4 text-gray-400 transition hover:text-orange-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Role selection */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      I want to join as
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            role: "user",
                          }))
                        }
                        aria-pressed={formData.role === "user"}
                        className={`rounded-xl border p-4 text-left transition ${
                          formData.role === "user"
                            ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500/10"
                            : "border-gray-200 bg-white hover:border-orange-200"
                        }`}
                      >
                        <FaUser
                          className={`mb-3 text-xl ${
                            formData.role === "user"
                              ? "text-orange-500"
                              : "text-gray-400"
                          }`}
                        />
                        <p className="text-sm font-bold">Customer</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Book local services
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            role: "worker",
                          }))
                        }
                        aria-pressed={formData.role === "worker"}
                        className={`rounded-xl border p-4 text-left transition ${
                          formData.role === "worker"
                            ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500/10"
                            : "border-gray-200 bg-white hover:border-orange-200"
                        }`}
                      >
                        <FaUserTie
                          className={`mb-3 text-xl ${
                            formData.role === "worker"
                              ? "text-orange-500"
                              : "text-gray-400"
                          }`}
                        />
                        <p className="text-sm font-bold">Worker</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Offer your services
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Submit registration */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/15 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending verification code..." : "Create account"}

                    {!loading && (
                      <FaArrowRight className="transition group-hover:translate-x-1" />
                    )}
                  </button>
                </form>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaShieldAlt className="text-orange-500" />
                  Your account is protected by email verification.
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?
                  <Link
                    to="/login"
                    className="ml-2 font-bold text-orange-600 transition hover:text-orange-700"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <>
                {/* OTP verification */}
                <button
                  type="button"
                  onClick={goBackToRegistration}
                  className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
                >
                  <FaArrowLeft />
                  Back to registration
                </button>

                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl text-orange-500">
                  <FaShieldAlt />
                </div>

                <p className="mb-3 text-xs font-bold tracking-[0.25em] text-orange-600">
                  EMAIL VERIFICATION
                </p>

                <h2 className="text-3xl font-extrabold tracking-tight">
                  Verify your email.
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Enter the 6-digit verification code sent to your email address.
                </p>

                <div className="mt-4 break-all rounded-xl border border-gray-200 bg-[#faf9f6] p-4 text-sm font-medium text-gray-700">
                  <FaEnvelope className="mr-2 inline text-orange-500" />
                  {formData.email}
                </div>

                {message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-5 rounded-xl border p-3.5 text-sm ${
                      messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="mt-7">
                  <label
                    htmlFor="register-otp"
                    className="mb-3 block text-sm font-semibold text-gray-700"
                  >
                    Verification code
                  </label>

                  <input
                    id="register-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-5 text-center text-3xl font-bold tracking-[0.6em] text-orange-600 outline-none transition placeholder:text-gray-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
                    required
                  />

                  <p className="mt-3 text-xs text-gray-500">
                    Enter all six digits to verify your account.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                    {!loading && <FaArrowRight />}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="mt-5 w-full rounded-lg py-2 text-sm font-bold text-orange-600 transition hover:text-orange-700 disabled:opacity-50"
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

export default Register;
