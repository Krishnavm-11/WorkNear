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

  const isAdminPage =
    location.pathname === "/admin-login" ||
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/admin-bookings") ||
    location.pathname.startsWith("/worker-approval") ||
    location.pathname.startsWith("/user-view") ||
    location.pathname.startsWith("/complaints");

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

        {/* Workers page */}
        <Route path="/workers" element={<Workers />} />

        {/* Worker details page */}
        <Route
          path="/worker/:id"
          element={<WorkerDetails />}
        />

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
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

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

        {/* Page not found */}
        <Route
          path="*"
          element={
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
              <h1 className="text-6xl font-bold text-orange-500">
                404
              </h1>

              <h2 className="text-2xl font-bold mt-4">
                Page Not Found
              </h2>

              <p className="text-gray-600 mt-2">
                The page you are looking for does not exist.
              </p>
            </div>
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