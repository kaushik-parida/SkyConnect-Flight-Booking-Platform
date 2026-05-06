import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "100%", width: "100%", maxWidth: "1400px", margin: "0 auto"
      }}>
        <Link to={isAdmin ? "/admin" : "/"} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "12px", fontSize: "20px",
            background: "linear-gradient(135deg, var(--accent) 0%, #7C3AED 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-accent)",
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-heading)", fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.5px" }}>
            Sky<span style={{ color: "var(--accent)" }}>Connect</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isAuthenticated && !isAdmin && (
            <Link to="/booking/history" style={{
              fontSize: "13px", fontWeight: "600", color: "var(--text-dim)",
              textDecoration: "none", padding: "7px 14px", borderRadius: "8px",
              transition: "var(--transition)",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(61,90,254,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
            >
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" style={{
              fontSize: "13px", fontWeight: "600", color: "var(--text-dim)",
              textDecoration: "none", padding: "7px 14px", borderRadius: "8px",
              transition: "var(--transition)",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(61,90,254,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}
            >
              Admin
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "4px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "9px",
                padding: "5px 14px 5px 6px", borderRadius: "99px",
                background: "rgba(255,255,255,0.85)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "800", color: "#fff",
                }}>
                  {user?.fullName?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-main)" }}>
                  {user?.fullName?.split(" ")[0] || "User"}
                </span>
                {isAdmin && (
                  <span className="badge badge-accent" style={{ fontSize: "8px", padding: "2px 7px" }}>ADMIN</span>
                )}
              </div>

              <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: "13px", padding: "8px 16px" }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to="/login" style={{
                fontSize: "13px", fontWeight: "600", color: "var(--text-dim)",
                textDecoration: "none", padding: "8px 16px", borderRadius: "8px",
              }}>Sign In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ fontSize: "13px", padding: "8px 20px" }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}