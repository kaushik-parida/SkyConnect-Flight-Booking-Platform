import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getBookingHistory, cancelBooking, cancelPassengerBookings, getFlightById } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [showFaq, setShowFaq] = useState(false);
  const [selectedPassengersToCancel, setSelectedPassengersToCancel] = useState([]);
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
          } catch {
            return b;
          }
        })
      );
      setBookings(enrichedBookings);
    } catch {
      showToast("Failed to load booking history", "error");
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const openCancelModal = (b) => {
    setCancelError("");
    setCancelTarget(b);
    if (b.passengers) {
      setSelectedPassengersToCancel(b.passengers.map(p => p.passengerId));
    } else {
      setSelectedPassengersToCancel([]);
    }
  };

  const handlePassengerToggle = (passengerId) => {
    setSelectedPassengersToCancel(prev => 
      prev.includes(passengerId) ? prev.filter(id => id !== passengerId) : [...prev, passengerId]
    );
  };

  const handleCancel = async () => {
    if (!cancelTarget || selectedPassengersToCancel.length === 0) return;
    setCancelling(true);
    setCancelError("");
    try {
      if (cancelTarget.passengers && selectedPassengersToCancel.length < cancelTarget.passengers.length) {
        await cancelPassengerBookings(cancelTarget.bookingReference, selectedPassengersToCancel, userId);
        showToast(`Successfully cancelled ${selectedPassengersToCancel.length} passenger(s)`);
      } else {
        await cancelBooking(cancelTarget.bookingReference, userId);
        showToast("Booking cancelled successfully");
      }
      setCancelTarget(null);
      loadHistory();
    } catch (err) {
      setCancelError(err.response?.data?.message || "Cancellation failed. Please try again.");
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
    <div className="app-container page-fixed-height">
      <Navbar />

      {toast && (
        <div className={`toast-notification badge badge-${toast.type === "error" ? "danger" : "success"}`}>
          {toast.msg}
        </div>
      )}

      <main className="scroll-area page-main">
        <div className="container page-container">

          <div className="animate-slide-up page-header-row">
            <div>
              <div className="badge badge-accent mb-12">My Account</div>
              <h1 className="page-title">My Bookings</h1>
              <p className="page-subtitle">Manage your upcoming and past flight reservations.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              ✈ Book New Flight
            </button>
          </div>

          {loading ? (
            <div className="empty-state-center">
              <div className="empty-state-icon">✈</div>
              <div className="empty-state-text">Loading your reservations...</div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card animate-scale-in empty-card">
              <div className="empty-icon">🎫</div>
              <h2 className="empty-title">No Bookings Yet</h2>
              <p className="empty-desc">
                You haven't made any flight reservations yet. Start your journey today!
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/")}>Search Flights</button>
            </div>
          ) : (
            <div className="history-layout">

              <div className="bookings-list">
                {bookings.map((b, i) => (
                  <div
                    key={b.bookingId}
                    className={`glass-card glass-card-hover animate-slide-up booking-card ${b.status === "CANCELLED" ? "booking-card-cancelled" : ""}`}
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                  >
                    <div className="booking-card-inner">
                      <div className="booking-card-main">
                        <div className="booking-ref-row">
                          <span className="booking-ref-text">PNR: {b.bookingReference}</span>
                          <span className={`badge badge-${b.status === "CONFIRMED" ? "success" : b.status === "CANCELLED" ? "danger" : "warning"}`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="booking-details-grid">
                          <div>
                            <div className="detail-label">Flight</div>
                            <div className="detail-value">{b.flightNumber || "—"}</div>
                          </div>
                          <div>
                            <div className="detail-label">Route</div>
                            <div className="detail-value">
                              {b.fromPlace && b.toPlace ? `${b.fromPlace} → ${b.toPlace}` : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="detail-label">Class</div>
                            <div className="detail-value">{b.seatClass || "—"}</div>
                          </div>
                          <div>
                            <div className="detail-label">Booked On</div>
                            <div className="detail-value">{formatDate(b.bookingTime)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="booking-card-actions">
                        <div>
                          <div className="detail-label">Amount Paid</div>
                          <div className="booking-amount">{displayAmount(b)}</div>
                        </div>

                        {b.status === "CONFIRMED" && (
                          <div className="booking-action-buttons">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                const flightData = b.flightNumber
                                  ? { flightNumber: b.flightNumber, fromPlace: b.fromPlace, toPlace: b.toPlace, departureTime: b.departureTime, arrivalTime: b.arrivalTime }
                                  : { flightNumber: "UNKNOWN", fromPlace: "—", toPlace: "—", departureTime: b.departureTime };
                                navigate("/boarding-pass", {
                                  state: {
                                    bookingId: b.bookingReference,
                                    flight: flightData,
                                    seatClass: b.seatClass || "ECONOMY",
                                    totalAmount: b.totalPrice,
                                    passengers: b.passengers || []
                                  }
                                });
                              }}
                            >
                              🎫 Boarding Pass
                            </button>
                            <button
                              className="btn btn-ghost btn-sm btn-cancel"
                              onClick={() => openCancelModal(b)}
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

              <div className="history-sidebar">
                <div className="glass-card animate-slide-up travel-hub-card">
                  <h3 className="hub-title">Travel Hub</h3>

                  <div className="hub-items">
                    <div className="hub-item hub-item-info">
                      <div className="hub-item-title hub-item-title-info">Check-In Open</div>
                      <p className="hub-item-desc">Web check-in opens 48 hours before your flight. Secure your preferred seat early!</p>
                    </div>

                    <div className="hub-item hub-item-warning">
                      <div className="hub-item-title hub-item-title-warning">Baggage Allowance</div>
                      <p className="hub-item-desc">Carry-on: 7kg limit. Checked baggage depends on your selected fare class.</p>
                    </div>
                  </div>

                  <div className="hub-actions">
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
        <div className="modal-overlay">
          <div className="glass-card animate-slide-up modal-card modal-card-danger">
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Cancel Reservation</h3>
            <p className="modal-desc">
              Are you sure you want to cancel your booking <strong>{cancelTarget.bookingReference}</strong>? This action cannot be undone and refunds may take 5-7 business days.
            </p>

            {cancelTarget.passengers && cancelTarget.passengers.length > 1 && (
              <div style={{ marginTop: "16px", marginBottom: "16px", textAlign: "left" }}>
                <label className="detail-label">Select passengers to cancel:</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  {cancelTarget.passengers.map(p => (
                    <label key={p.passengerId} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={selectedPassengersToCancel.includes(p.passengerId)}
                        onChange={() => handlePassengerToggle(p.passengerId)}
                        style={{ width: "16px", height: "16px", accentColor: "#ef4444" }}
                      />
                      <span style={{ fontSize: "14px", color: "var(--text-main)" }}>
                        {p.firstName} {p.lastName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {cancelError && (
              <div className="modal-error-box">
                ⚠ {cancelError}
              </div>
            )}

            <div className="modal-actions">
              <button
                className="btn btn-danger modal-btn"
                onClick={handleCancel}
                disabled={cancelling || selectedPassengersToCancel.length === 0}
              >
                {cancelling ? "Cancelling..." : selectedPassengersToCancel.length > 0 && cancelTarget.passengers && selectedPassengersToCancel.length < cancelTarget.passengers.length ? `Cancel ${selectedPassengersToCancel.length} Passenger(s)` : "Yes, Cancel Booking"}
              </button>
              <button
                className="btn btn-ghost modal-btn"
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
        <div className="modal-overlay">
          <div className="glass-card animate-scale-in modal-card modal-card-accent modal-card-relative">
            <button
              onClick={() => setShowFaq(false)}
              className="modal-close-btn"
            >
              ✕
            </button>
            <h3 className="modal-title">Support & FAQs</h3>
            <p className="modal-subtitle">Find quick answers to common flight booking questions.</p>

            <div className="faq-list">
              <div>
                <h4 className="faq-question">How do I cancel a flight?</h4>
                <p className="faq-answer">You can cancel your flight directly from the 'My Bookings' page by clicking the 'Cancel' button next to an active booking. Cancellations are allowed up to 24 hours before departure.</p>
              </div>
              <div className="divider" />
              <div>
                <h4 className="faq-question">When will I receive my refund?</h4>
                <p className="faq-answer">Refunds for cancelled flights are automatically processed to the original payment method and typically reflect in your account within 5-7 business days.</p>
              </div>
              <div className="divider" />
              <div>
                <h4 className="faq-question">Can I change my seat class?</h4>
                <p className="faq-answer">Currently, seat class modifications are not supported post-booking. You will need to cancel your existing reservation and book a new flight with the desired class.</p>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => setShowFaq(false)} style={{ width: "100%", marginTop: "32px" }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
