import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import WorkerRoute from "./components/WorkerRoute";

// User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Workers from "./pages/Workers";
import WorkerDetails from "./pages/WorkerDetails";
import Booking from "./pages/Booking";
import UserProfile from "./pages/UserProfile";
import RegisterComplaint from "./pages/RegisterComplaint";
import SavedWorkers from "./pages/SavedWorkers";

// Worker pages
import WorkerDashboard from "./pages/WorkerDashboard";
import CreateWorkerProfile from "./pages/CreateWorkerProfile";
import EditWorkerProfile from "./pages/EditWorkerProfile";
import WorkerContact from "./pages/WorkerContact";

// Admin pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import BookingView from "./pages/Admin/BookingView";
import WorkerApproval from "./pages/Admin/WorkerApproval";
import UserView from "./pages/Admin/UserView";
import ComplaintView from "./pages/Admin/ComplaintView";

function AppContent() {
  const location = useLocation();

  // Hide the main Navbar and Footer on admin pages.
  const isAdminPage =
    location.pathname === "/admin-login" ||
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/admin-bookings") ||
    location.pathname.startsWith("/worker-approval") ||
    location.pathname.startsWith("/user-view") ||
    location.pathname.startsWith("/complaints");

  // Hide the main Navbar and Footer on worker pages.
  const isWorkerPage = [
    "/worker-dashboard",
    "/worker-contact",
    "/create-worker-profile",
    "/edit-worker-profile",
  ].some(
    (path) =>
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
  );

  const hideLayout = isAdminPage || isWorkerPage;

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        {/* ================= WORKERS PAGE ================= */}

        <Route
          path="/workers"
          element={<Workers />}
        />

        {/* ================= WORKER DETAILS ================= */}

        <Route
          path="/worker/:id"
          element={<WorkerDetails />}
        />

        {/* ================= USER ROUTES ================= */}

        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-workers"
          element={
            <ProtectedRoute>
              <SavedWorkers />
            </ProtectedRoute>
          }
        />

        {/* ================= REGISTER COMPLAINT ================= */}

        <Route
          path="/register-complaint"
          element={
            <ProtectedRoute>
              <RegisterComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-complaint/:workerId/:bookingId"
          element={
            <ProtectedRoute>
              <RegisterComplaint />
            </ProtectedRoute>
          }
        />

        {/* ================= WORKER ROUTES ================= */}

        {/* Worker dashboard */}
        <Route
          path="/worker-dashboard"
          element={
            <WorkerRoute>
              <WorkerDashboard />
            </WorkerRoute>
          }
        />

        {/* Create worker profile */}
        <Route
          path="/create-worker-profile"
          element={
            <WorkerRoute>
              <CreateWorkerProfile />
            </WorkerRoute>
          }
        />

        {/* Edit worker profile */}
        <Route
          path="/edit-worker-profile"
          element={
            <WorkerRoute>
              <EditWorkerProfile />
            </WorkerRoute>
          }
        />

        {/* Worker contact and support */}
        <Route
          path="/worker-contact"
          element={
            <WorkerRoute>
              <WorkerContact />
            </WorkerRoute>
          }
        />

        {/* ================= ADMIN LOGIN ================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-bookings"
          element={
            <AdminRoute>
              <BookingView />
            </AdminRoute>
          }
        />

        <Route
          path="/worker-approval"
          element={
            <AdminRoute>
              <WorkerApproval />
            </AdminRoute>
          }
        />

        <Route
          path="/user-view"
          element={
            <AdminRoute>
              <UserView />
            </AdminRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <AdminRoute>
              <ComplaintView />
            </AdminRoute>
          }
        />

        {/* ================= PAGE NOT FOUND ================= */}

        <Route
          path="*"
          element={
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
              <h1 className="text-6xl font-bold text-orange-500">
                404
              </h1>

              <h2 className="mt-4 text-2xl font-bold">
                Page Not Found
              </h2>

              <p className="mt-2 text-gray-600">
                The page you are looking for does not exist.
              </p>
            </div>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;