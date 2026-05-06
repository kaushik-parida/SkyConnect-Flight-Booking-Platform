import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getBookingHistory, cancelBooking, getFlightById } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
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
      const bookingsList = data.content || [];

      const enrichedBookings = await Promise.all(
        bookingsList.map(async (b) => {
          if (!b.flightId) return b;
          try {
            const flight = await getFlightById(b.flightId);
            return {
              ...b,
              flightNumber: flight.flightNumber,
              fromPlace: flight.fromPlace,
              toPlace: flight.toPlace,
              arrivalTime: flight.arrivalTime,
              departureTime: flight.departureTime || b.departureTime
            };
          } catch (e) {
            console.error(`Failed to fetch flight details for flightId ${b.flightId}:`, e.response?.data || e.message);
            return b;
          }
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      showToast("Failed to load booking history", "error");
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

  const displayAmount = (b) => {
    if (b.totalPrice && Number(b.totalPrice) > 0) return `₹${Number(b.totalPrice).toLocaleString("en-IN")}`;
    if (b.totalAmount && Number(b.totalAmount) > 0) return `₹${Number(b.totalAmount).toLocaleString("en-IN")}`;
    if (b.ticketPrice && Number(b.ticketPrice) > 0) return `₹${Number(b.ticketPrice).toLocaleString("en-IN")}`;
    return "—";
  };

  return (
    <div className="app-container" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {toast && (
        <div
          className={`badge badge-${toast.type === "error" ? "danger" : "success"}`}
          style={{ position: "fixed", top: "90px", right: "32px", zIndex: 1000, padding: "12px 24px", boxShadow: "var(--shadow-md)", borderRadius: "12px" }}
        >
          {toast.msg}
        </div>
      )}

      <main className="scroll-area" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="container" style={{ maxWidth: "1440px", width: "95%", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: "24px" }}>

          <div className="animate-slide-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexShrink: 0, marginTop: "24px" }}>
            <div>
              <div className="badge badge-accent" style={{ marginBottom: "12px", background: "rgba(30,58,138,0.2)", color: "#1E3A8A", borderColor: "rgba(30,58,138,0.5)" }}>My Account</div>
              <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "4px" }}>My Bookings</h1>
              <p style={{ color: "var(--text-dim)" }}>Manage your upcoming and past flight reservations.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              ✈ Book New Flight
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 0" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.4 }}>✈</div>
                <div style={{ color: "var(--text-muted)", fontWeight: "600" }}>Loading your reservations...</div>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card animate-scale-in" style={{ padding: "80px", textAlign: "center" }}>
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎫</div>
              <h2 style={{ marginBottom: "12px", color: "var(--text-heading)" }}>No Bookings Yet</h2>
              <p style={{ color: "var(--text-dim)", marginBottom: "32px", maxWidth: "340px", margin: "0 auto 32px" }}>
                You haven't made any flight reservations yet. Start your journey today!
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/")}>Search Flights</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flex: 1, minHeight: 0 }}>

              <div style={{ flex: "7", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", height: "100%", paddingRight: "12px" }}>
                {bookings.map((b, i) => (
                  <div
                    key={b.bookingId}
                    className="glass-card glass-card-hover animate-slide-up"
                    style={{
                      padding: "24px 28px", animationDelay: `${i * 60}ms`, animationFillMode: "both",
                      opacity: b.status === "CANCELLED" ? 0.6 : 1,
                      filter: b.status === "CANCELLED" ? "grayscale(80%)" : "none"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--accent)", fontFamily: "'Outfit',sans-serif" }}>
                            PNR: {b.bookingReference}
                          </span>
                          <span className={`badge badge-${b.status === "CONFIRMED" ? "success" : b.status === "CANCELLED" ? "danger" : "warning"}`}>
                            {b.status}
                          </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px", fontWeight: "700" }}>Flight</div>
                            <div style={{ fontWeight: "800", color: "var(--text-heading)", fontSize: "15px" }}>{b.flightNumber || "—"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px", fontWeight: "700" }}>Route</div>
                            <div style={{ fontWeight: "800", color: "var(--text-heading)", fontSize: "15px" }}>
                              {b.fromPlace && b.toPlace ? `${b.fromPlace} → ${b.toPlace}` : "—"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px", fontWeight: "700" }}>Class</div>
                            <div style={{ fontWeight: "800", color: "var(--text-heading)", fontSize: "15px" }}>{b.seatClass || "—"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px", fontWeight: "700" }}>Booked On</div>
                            <div style={{ fontWeight: "800", color: "var(--text-heading)", fontSize: "15px" }}>{formatDate(b.bookingTime)}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end", flexShrink: 0 }}>
                        <div>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px", fontWeight: "700" }}>Amount Paid</div>
                          <div style={{ fontSize: "20px", fontWeight: "900", color: "var(--success)", fontFamily: "'Outfit',sans-serif" }}>
                            {displayAmount(b)}
                          </div>
                        </div>

                        {b.status === "CONFIRMED" && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding: "6px 12px", fontSize: "12px", minWidth: "140px" }}
                              onClick={() => {
                                const flightData = b.flightNumber ? { flightNumber: b.flightNumber, fromPlace: b.fromPlace, toPlace: b.toPlace, departureTime: b.departureTime, arrivalTime: b.arrivalTime } : { flightNumber: "UNKNOWN", fromPlace: "—", toPlace: "—", departureTime: b.departureTime };
                                navigate("/boarding-pass", { state: { bookingId: b.bookingReference, flight: flightData, seatClass: b.seatClass || "ECONOMY", totalAmount: b.totalPrice, passenger: b.passengers?.[0] } });
                              }}
                            >
                              🎫 Boarding Pass
                            </button>
                            <button
                              className="btn btn-ghost"
                              style={{ padding: "6px 12px", fontSize: "12px", color: "var(--danger)", background: "rgba(220,38,38,0.05)" }}
                              onClick={() => setCancelTarget(b)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ flex: "3", height: "100%" }}>
                <div className="glass-card animate-slide-up" style={{ padding: "32px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "24px", flexShrink: 0 }}>Travel Hub</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto" }}>
                    <div style={{ background: "rgba(37,99,235,0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(37,99,235,0.15)" }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--info)", marginBottom: "8px" }}>Check-In Open</div>
                      <p style={{ fontSize: "13px", color: "var(--text-dim)", margin: 0, lineHeight: 1.5 }}>Web check-in opens 48 hours before your flight. Secure your preferred seat early!</p>
                    </div>

                    <div style={{ background: "rgba(215,119,0,0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(215,119,0,0.15)" }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--warning)", marginBottom: "8px" }}>Baggage Allowance</div>
                      <p style={{ fontSize: "13px", color: "var(--text-dim)", margin: 0, lineHeight: 1.5 }}>Carry-on: 7kg limit. Checked baggage depends on your selected fare class.</p>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "20px", marginTop: "16px", flexShrink: 0 }}>
                    <button className="btn btn-primary" onClick={() => navigate("/")} style={{ width: "100%" }}>
                      Book New Flight
                    </button>
                    <button className="btn btn-ghost" onClick={() => setShowFaq(true)} style={{ width: "100%", marginTop: "12px" }}>
                      View Support & FAQs
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {cancelTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div className="glass-card animate-slide-up" style={{ padding: "40px", maxWidth: "440px", textAlign: "center", borderTop: "4px solid var(--danger)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
            <h3 style={{ fontSize: "24px", color: "var(--text-heading)", marginBottom: "16px" }}>Cancel Reservation</h3>
            <p style={{ color: "var(--text-dim)", marginBottom: "32px", fontSize: "15px", lineHeight: "1.6" }}>
              Are you sure you want to cancel your booking <strong>{cancelTarget.bookingReference}</strong>? This action cannot be undone and refunds may take 5-7 business days.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn btn-danger"
                style={{ flex: 1, padding: "14px", fontSize: "14px" }}
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1, padding: "14px", fontSize: "14px" }}
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showFaq && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div className="glass-card animate-scale-in" style={{ padding: "40px", maxWidth: "600px", width: "100%", borderTop: "4px solid var(--accent)", position: "relative" }}>
            <button
              onClick={() => setShowFaq(false)}
              style={{ position: "absolute", top: "24px", right: "24px", background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--text-muted)" }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: "24px", color: "var(--text-heading)", marginBottom: "8px", fontWeight: "800" }}>Support & FAQs</h3>
            <p style={{ color: "var(--text-dim)", marginBottom: "32px" }}>Find quick answers to common flight booking questions.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
              <div>
                <h4 style={{ fontSize: "16px", color: "var(--text-main)", marginBottom: "8px", fontWeight: "700" }}>How do I cancel a flight?</h4>
                <p style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: "1.6", margin: 0 }}>You can cancel your flight directly from the 'My Bookings' page by clicking the 'Cancel' button next to an active booking. Cancellations are allowed up to 24 hours before departure.</p>
              </div>
              <div style={{ height: "1px", background: "var(--glass-border)" }} />

              <div>
                <h4 style={{ fontSize: "16px", color: "var(--text-main)", marginBottom: "8px", fontWeight: "700" }}>When will I receive my refund?</h4>
                <p style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: "1.6", margin: 0 }}>Refunds for cancelled flights are automatically processed to the original payment method and typically reflect in your account within 5-7 business days.</p>
              </div>
              <div style={{ height: "1px", background: "var(--glass-border)" }} />

              <div>
                <h4 style={{ fontSize: "16px", color: "var(--text-main)", marginBottom: "8px", fontWeight: "700" }}>Can I change my seat class?</h4>
                <p style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: "1.6", margin: 0 }}>Currently, seat class modifications are not supported post-booking. You will need to cancel your existing reservation and book a new flight with the desired class.</p>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => setShowFaq(false)} style={{ width: "100%", marginTop: "32px" }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
