import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import WorkerRoute from "./components/WorkerRoute";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Workers from "./pages/Workers";
import WorkerDetails from "./pages/WorkerDetails";
import Booking from "./pages/Booking";
import UserProfile from "./pages/UserProfile";
import AddReview from "./pages/AddReview";
import RegisterComplaint from "./pages/RegisterComplaint";

// Worker Page
import WorkerDashboard from "./pages/WorkerDashboard";
import CreateWorkerProfile from "./pages/CreateWorkerProfile";
import EditWorkerProfile from "./pages/EditWorkerProfile";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookingView from "./pages/admin/BookingView";
import WorkerApproval from "./pages/admin/WorkerApproval";
import UserView from "./pages/admin/UserView";
import ComplaintView from "./pages/admin/ComplaintView";

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

        {/* Public Pages */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/workers" element={<Workers />} />

        <Route path="/worker/:id" element={<WorkerDetails />} />

        {/* User Routes */}

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

        {/* Worker Routes */}

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

        {/* Admin Login */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* Admin Routes */}

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