import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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

// Worker pages
import WorkerDashboard from "./pages/WorkerDashboard";
import CreateWorkerProfile from "./pages/CreateWorkerProfile";
import EditWorkerProfile from "./pages/EditWorkerProfile";

// Admin pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import BookingView from "./pages/Admin/BookingView";
import WorkerApproval from "./pages/Admin/WorkerApproval";
import UserView from "./pages/Admin/UserView";
import ComplaintView from "./pages/Admin/ComplaintView";

function AppContent() {
  const location = useLocation();

  const adminPages = [
    "/admin-login",
    "/admin-dashboard",
    "/admin-bookings",
    "/worker-approval",
    "/user-view",
    "/complaints",
  ];

  const isAdminPage = adminPages.includes(location.pathname);

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/worker/:id" element={<WorkerDetails />} />

        {/* User routes */}
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

        {/* Worker routes */}
        <Route
          path="/worker-dashboard"
          element={
            <WorkerRoute>
              <WorkerDashboard />
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

        {/* Admin login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin routes */}
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
      </Routes>

      {!isAdminPage && <Footer />}
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