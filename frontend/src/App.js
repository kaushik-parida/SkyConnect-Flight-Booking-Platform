import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import UserPage from "./pages/Home/UserPage";
import ResultsPage from "./pages/Home/ResultsPage";
import BookingPage from "./pages/Booking/BookingPage";
import BookingHistoryPage from "./pages/Booking/BookingHistoryPage";
import BookingConfirmationPage from "./pages/Booking/BookingConfirmationPage";
import AdminPage from "./pages/Admin/AdminPage";
import BoardingPassPage from "./pages/Booking/BoardingPassPage";

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<UserPage />} />
      <Route path="/results" element={<ResultsPage />} />

      <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/booking/history" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
      <Route path="/booking/confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
      <Route path="/boarding-pass" element={<ProtectedRoute><BoardingPassPage /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
