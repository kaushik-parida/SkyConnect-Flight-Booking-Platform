import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getBookingHistory, cancelBooking } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadHistory = useCallback(async () => {
    if (!userId) { navigate("/login"); return; }
    setLoading(true);
    try {
      const data = await getBookingHistory(userId);
      setBookings(data.content || []);
    } catch {
      showToast("Failed to load history", "error");
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelBooking(cancelTarget.bookingReference, userId);
      showToast("Booking cancelled successfully");
      setCancelTarget(null);
      loadHistory();
    } catch (err) {
      showToast(err.response?.data?.message || "Cancellation failed", "error");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      
      {toast && (
        <div className={`badge badge-${toast.type === 'error' ? 'danger' : 'success'}`} 
             style={{ position: "fixed", top: "100px", right: "40px", zIndex: 1000, padding: "12px 24px" }}>
          {toast.msg}
        </div>
      )}

      <main className="scroll-area">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--white)" }}>My Bookings</h1>
              <p style={{ color: "var(--text-dim)" }}>Manage your upcoming and past flight reservations.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Book New Flight
            </button>
          </div>

          {loading ? (
             <div style={{ display: "flex", justifyContent: "center", padding: "100px" }}>
                <span className="badge badge-warning">Loading records...</span>
             </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card" style={{ padding: "80px", textAlign: "center" }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>✈</div>
              <h2 style={{ marginBottom: "12px" }}>No Bookings Yet</h2>
              <p style={{ color: "var(--text-dim)", marginBottom: "32px" }}>You haven't made any flight reservations yet. Start your journey today!</p>
              <button className="btn btn-primary" onClick={() => navigate("/")}>Search Flights</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {bookings.map((b) => (
                <div key={b.bookingId} className="glass-card glass-card-hover animate-slide-up" style={{ padding: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent)" }}>PNR: {b.bookingReference}</span>
                        <span className={`badge badge-${b.status === 'CONFIRMED' ? 'success' : b.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                          {b.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4" style={{ gap: "24px" }}>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Flight</div>
                          <div style={{ fontWeight: "700", color: "var(--white)" }}>{b.flightNumber || "SK-00"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Route</div>
                          <div style={{ fontWeight: "700", color: "var(--white)" }}>{b.fromPlace} → {b.toPlace}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Class</div>
                          <div style={{ fontWeight: "700", color: "var(--white)" }}>{b.seatClass}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Booked On</div>
                          <div style={{ fontWeight: "700", color: "var(--white)" }}>{formatDate(b.bookingTime)}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", borderLeft: "1px solid var(--glass-border)", paddingLeft: "28px", minWidth: "160px" }}>
                      <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>Amount Paid</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--white)", margin: "4px 0 16px" }}>₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}</div>
                      {b.status === "CONFIRMED" && (
                        <button className="btn btn-danger" onClick={() => setCancelTarget(b)} style={{ padding: "8px 20px", fontSize: "13px", width: "100%" }}>
                          Cancel Flight
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cancel Modal */}
      {cancelTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div className="glass-card animate-slide-up" style={{ padding: "40px", maxWidth: "400px", textAlign: "center", borderTop: "4px solid var(--danger)" }}>
            <div style={{ fontSize: "44px", marginBottom: "16px" }}>⚠️</div>
            <h3 style={{ color: "var(--white)", marginBottom: "8px" }}>Cancel Booking?</h3>
            <p style={{ color: "var(--text-dim)", marginBottom: "32px" }}>
              Are you sure you want to cancel booking <strong>{cancelTarget.bookingReference}</strong>?<br />
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "Processing..." : "Yes, Cancel"}
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setCancelTarget(null)}>No, Keep It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
