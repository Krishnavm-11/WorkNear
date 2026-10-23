
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import WorkerRoute from "./components/WorkerRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Workers from "./pages/Workers";
import WorkerDetails from "./pages/WorkerDetails";
import Booking from "./pages/Booking";
import UserProfile from "./pages/UserProfile";
import SavedWorkers from "./pages/SavedWorkers";
import RegisterComplaint from "./pages/RegisterComplaint";
import WorkerContact from "./pages/WorkerContact";

// Worker pages
import WorkerDashboard from "./pages/WorkerDashboard";
import CreateWorkerProfile from "./pages/CreateWorkerProfile";
import EditWorkerProfile from "./pages/EditWorkerProfile";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import WorkerApproval from "./pages/WorkerApproval";
import UserView from "./pages/UserView";
import Complaints from "./pages/Complaints";

function AppContent() {
  const location = useLocation();

  const isAuthPage = ["/login", "/register"].includes(
    location.pathname
  );

  const isAdminPage = [
    "/admin-login",
    "/admin-dashboard",
    "/admin-bookings",
    "/worker-approval",
    "/user-view",
    "/complaints",
  ].includes(location.pathname);

  const isWorkerPage = [
    "/worker-dashboard",
    "/worker-contact",
    "/create-worker-profile",
    "/edit-worker-profile",
  ].includes(location.pathname);

  // Hide the shared Navbar and Footer on the user dashboard too.
  const isUserDashboard = location.pathname === "/profile";

  const hideLayout =
    isAuthPage ||
    isAdminPage ||
    isWorkerPage ||
    isUserDashboard;

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/workers" element={<Workers />} />
        <Route
          path="/worker/:id"
          element={<WorkerDetails />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User pages */}
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

        <Route
          path="/booking/:workerId"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-review/:workerId/:bookingId"
          element={
            <ProtectedRoute>
              <WorkerDetails />
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

        {/* Worker pages */}
        <Route
          path="/worker-dashboard"
          element={
            <WorkerRoute>
              <WorkerDashboard />
            </WorkerRoute>
          }
        />

        <Route
          path="/worker-contact"
          element={
            <WorkerRoute>
              <WorkerContact />
            </WorkerRoute>
          }
        />

        <Route
          path="/create-worker-profile"
          element={
            <WorkerRoute>
              <CreateWorkerProfile />
            </WorkerRoute>
          }
        />

        <Route
          path="/edit-worker-profile"
          element={
            <WorkerRoute>
              <EditWorkerProfile />
            </WorkerRoute>
          }
        />

        {/* Admin pages */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

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
              <AdminBookings />
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
              <Complaints />
            </AdminRoute>
          }
        />

        {/* Not found */}
        <Route
          path="*"
          element={<h2>404 - Page Not Found</h2>}
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
