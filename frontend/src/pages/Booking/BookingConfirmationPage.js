import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function BookingConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingId, flight, seatClass } = state || {};

  useEffect(() => {
    if (!bookingId) navigate("/");
  }, [bookingId, navigate]);

  if (!bookingId) return null;

  return (
    <div className="app-container">
      <Navbar />
      <main className="scroll-area" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-slide-up" style={{ maxWidth: "540px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%", margin: "0 auto 24px",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))",
              border: "2px solid rgba(16, 185, 129, 0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "48px", boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)"
            }}>✓</div>
            <h1 className="hero-title" style={{ fontSize: "40px", marginBottom: "8px" }}>Success!</h1>
            <p className="hero-subtitle" style={{ margin: "0 auto" }}>Your flight reservation is confirmed.</p>
          </div>

          <div className="glass-card" style={{ padding: "40px", borderTop: "4px solid var(--success)" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Booking ID</div>
              <div style={{ fontSize: "42px", fontWeight: "800", color: "var(--cyan)", letterSpacing: "4px" }}>#{bookingId}</div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>Please keep this ID for your flight check-in.</p>
            </div>

            <div style={{ borderTop: "1px dashed var(--glass-border)", paddingTop: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>Flight</div>
                <div style={{ fontWeight: "700", color: "var(--white)", fontSize: "16px" }}>{flight?.flightNumber || "SK-SKY"}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>Cabin Class</div>
                <div style={{ fontWeight: "700", color: "var(--white)", fontSize: "16px" }}>{seatClass}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>Departure</div>
                <div style={{ fontWeight: "700", color: "var(--white)", fontSize: "16px" }}>{flight?.fromPlace}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>Destination</div>
                <div style={{ fontWeight: "700", color: "var(--white)", fontSize: "16px" }}>{flight?.toPlace}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
            <button className="btn btn-primary" onClick={() => navigate("/booking/history")} style={{ flex: 1 }}>
              View My Bookings
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("/")} style={{ flex: 1 }}>
              Return Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
