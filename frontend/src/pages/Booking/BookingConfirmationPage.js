import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getBookingById } from "../../services/api";

export default function BookingConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingId, flight, seatClass, totalAmount, passengers } = state || {};
  const [bookingReference, setBookingReference] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      navigate("/");
      return;
    }
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        if (data && data.bookingReference) {
          setBookingReference(data.bookingReference);
        }
      } catch (err) {
        console.error("Failed to fetch booking details", err);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  if (!bookingId) return null;

  const passengerList = passengers && passengers.length > 0 ? passengers : [];
  const primaryPassenger = passengerList[0];

  return (
    <div className="app-container">
      <Navbar />
      <main className="scroll-area confirmation-scroll">
        <div className="container animate-slide-up confirmation-container">

          <div className="glass-card confirmation-card">

            <div className="confirmation-left">
              <div className="confirmation-check-circle">✓</div>
              <h1 className="confirmation-title">Booking Confirmed!</h1>
              <p className="confirmation-subtitle">
                Your flight reservation has been processed successfully. Prepare for a wonderful journey with SkyConnect.
              </p>
              {passengerList.length > 1 && (
                <div className="passenger-count-badge">
                  {passengerList.length} passengers booked
                </div>
              )}
            </div>

            <div className="confirmation-right">

              <div>
                <div className="confirmation-ref-row">
                  <div>
                    <div className="confirmation-ref-label">Booking Reference</div>
                    <div className="confirmation-ref-value">{bookingReference || `#${bookingId}`}</div>
                  </div>
                  <div className="text-right">
                    <div className="confirmation-ref-label">Amount Paid</div>
                    <div className="confirmation-amount">{totalAmount ? `₹${Number(totalAmount).toLocaleString("en-IN")}` : "—"}</div>
                  </div>
                </div>

                <div className="confirmation-divider" />

                <div className="grid grid-cols-2 confirmation-details-grid">
                  <div>
                    <div className="confirmation-detail-label">Flight Number</div>
                    <div className="confirmation-detail-value">{flight?.flightNumber || "SK-SKY"}</div>
                  </div>
                  <div>
                    <div className="confirmation-detail-label">Cabin Class</div>
                    <div className="confirmation-detail-value">{seatClass}</div>
                  </div>
                  <div className="grid-span-2">
                    <div className="confirmation-detail-label">Route Details</div>
                    <div className="confirmation-route">
                      <span>{flight?.fromPlace}</span>
                      <span className="text-accent">✈</span>
                      <span>{flight?.toPlace}</span>
                    </div>
                  </div>
                  {primaryPassenger && (
                    <div className="grid-span-2">
                      <div className="confirmation-detail-label">Lead Passenger</div>
                      <div className="confirmation-detail-value">{primaryPassenger.firstName} {primaryPassenger.lastName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="confirmation-actions">
                <button
                  className="btn btn-primary confirmation-btn-primary"
                  onClick={() => navigate("/boarding-pass", {
                    state: { bookingId, bookingReference, flight, seatClass, totalAmount, passengers: passengerList }
                  })}
                >
                  🎫 View Boarding Pass{passengerList.length > 1 ? "es" : ""}
                </button>
                <button className="btn btn-ghost confirmation-btn-secondary" onClick={() => navigate("/booking/history")}>
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
