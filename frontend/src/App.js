import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import UserPage from "./pages/Home/UserPage";
import ResultsPage from "./pages/Home/ResultsPage";
import BookingPage from "./pages/Booking/BookingPage";
import BookingHistoryPage from "./pages/Booking/BookingHistoryPage";
import BookingConfirmationPage from "./pages/Booking/BookingConfirmationPage";
import AdminPage from "./pages/Admin/AdminPage";

/**
 * Protected Route component to guard sensitive views.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/booking/history" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
      <Route path="/booking/confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}