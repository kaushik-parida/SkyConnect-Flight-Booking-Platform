import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", width: "100%", maxWidth: "1400px" }}>
        {/* Logo */}
        <Link to={isAdmin ? "/admin" : "/"} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{
            width: 42, height: 42, borderRadius: "12px",
            background: "linear-gradient(135deg, var(--accent), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, color: "#fff",
            boxShadow: "var(--shadow-accent)"
          }}>✈</div>
          <span style={{ fontSize: 24, fontWeight: 800, color: "var(--white)", letterSpacing: "-0.5px" }}>
            Sky<span style={{ color: "var(--cyan)" }}>Connect</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAuthenticated && !isAdmin && (
            <Link to="/booking/history" className="btn btn-ghost" style={{ border: "none" }}>
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="btn btn-ghost" style={{ border: "none" }}>
              Admin Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: 16 }}>
              <div className="glass-card" style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 14px", borderRadius: "30px", background: "rgba(255,255,255,0.05)"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: "#fff"
                }}>
                  {user.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-main)" }}>
                  {user.fullName?.split(" ")[0] || "User"}
                </span>
                {isAdmin && (
                  <span className="badge badge-warning" style={{ fontSize: 9, marginLeft: 4 }}>ADMIN</span>
                )}
              </div>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: "10px 20px", fontSize: 14 }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/login" className="btn btn-ghost" style={{ border: "none" }}>Sign In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>
                Join SkyConnect
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}