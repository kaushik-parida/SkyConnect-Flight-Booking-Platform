import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function BookingConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingId, flight, seatClass, totalAmount, passenger } = state || {};

  useEffect(() => {
    if (!bookingId) navigate("/");
  }, [bookingId, navigate]);

  if (!bookingId) return null;

  return (
    <div className="app-container">
      <Navbar />
      <main className="scroll-area" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 72px)", overflow: "hidden" }}>
        <div className="container animate-slide-up" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "1200px" }}>

          <div className="glass-card" style={{ display: "flex", flexDirection: "row", overflow: "hidden", width: "100%", borderTop: "4px solid var(--success)", boxShadow: "0 24px 64px rgba(5,150,105,0.12), 0 4px 16px rgba(0,0,0,0.06)" }}>

            <div style={{ flex: 1, background: "linear-gradient(135deg, rgba(5,150,105,0.05), rgba(5,150,105,0.15))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 40px", borderRight: "1px dashed var(--glass-border)" }}>
              <div style={{
                width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto 32px",
                background: "#fff",
                border: "2px solid rgba(5,150,105,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "56px", boxShadow: "0 0 0 12px rgba(5,150,105,0.1)",
                color: "var(--success)"
              }}>✓</div>
              <h1 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "16px", color: "var(--text-heading)", fontFamily: "'Outfit',sans-serif", textAlign: "center" }}>Booking Confirmed!</h1>
              <p style={{ color: "var(--text-dim)", fontSize: "16px", textAlign: "center", maxWidth: "340px", lineHeight: "1.6" }}>
                Your flight reservation has been processed successfully. Prepare for a wonderful journey with SkyConnect.
              </p>
            </div>

            <div style={{ flex: 1.2, padding: "50px 60px", background: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px", fontWeight: "700" }}>Booking Reference</div>
                    <div style={{ fontSize: "48px", fontWeight: "900", color: "var(--accent)", letterSpacing: "2px", fontFamily: "'Outfit',sans-serif", lineHeight: "1" }}>
                      #{bookingId}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px", fontWeight: "700" }}>Amount Paid</div>
                    <div style={{ fontWeight: "900", fontSize: "28px", color: "var(--success)", fontFamily: "'Outfit',sans-serif", lineHeight: "1" }}>
                      {totalAmount ? `₹${Number(totalAmount).toLocaleString("en-IN")}` : "—"}
                    </div>
                  </div>
                </div>

                <div style={{ height: "1px", background: "rgba(148,163,184,0.2)", margin: "0 0 32px" }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontWeight: "700" }}>Flight Number</div>
                    <div style={{ fontWeight: "800", fontSize: "18px", color: "var(--text-heading)" }}>{flight?.flightNumber || "SK-SKY"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontWeight: "700" }}>Cabin Class</div>
                    <div style={{ fontWeight: "800", fontSize: "18px", color: "var(--text-heading)" }}>{seatClass}</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", fontWeight: "700" }}>Route Details</div>
                    <div style={{ fontWeight: "800", fontSize: "20px", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span>{flight?.fromPlace}</span>
                      <span style={{ color: "var(--accent)" }}>✈</span>
                      <span>{flight?.toPlace}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginTop: "48px" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/boarding-pass", { state: { bookingId, flight, seatClass, totalAmount, passenger } })}
                  style={{ flex: 1.5, fontSize: "15px", padding: "16px", borderRadius: "12px" }}
                >
                  🎫 View Boarding Pass
                </button>
                <button className="btn btn-ghost" onClick={() => navigate("/booking/history")} style={{ flex: 1, fontSize: "15px", padding: "16px", borderRadius: "12px" }}>
                  My Bookings
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
