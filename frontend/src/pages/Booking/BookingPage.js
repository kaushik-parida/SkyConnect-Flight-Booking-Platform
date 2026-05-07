import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { createBooking } from "../../services/api";
import { formatTime } from "../../utils/dateUtils";

const MEAL_OPTIONS = [
  { value: "VEGETARIAN", label: "Vegetarian", desc: "Plant-based meals" },
  { value: "NONVEGETARIAN", label: "Non-Vegetarian", desc: "Includes chicken & fish" },
  { value: "NONE", label: "No Meal", desc: "Skip in-flight meal" },
];

const PAYMENT_METHODS = [
  { value: "CARD", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex" },
  { value: "UPI", label: "UPI", desc: "GPay, PhonePe, Paytm" },
  { value: "NETBANKING", label: "Net Banking", desc: "All major Indian banks" },
];

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flight;

  const [seatClass, setSeatClass] = useState("ECONOMY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [passengers, setPassengers] = useState([{
    firstName: "", lastName: "", gender: "MALE",
    passportNumber: "", dateOfBirth: "", mealPreference: "VEGETARIAN"
  }]);

  const [paymentMethod, setPaymentMethod] = useState("CARD");

  const updatePassenger = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, {
      firstName: "", lastName: "", gender: "MALE",
      passportNumber: "", dateOfBirth: "", mealPreference: "VEGETARIAN"
    }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  if (!flight) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="scroll-area center-content">
          <div className="glass-card centered-card">
            <h2 className="mb-20">No Flight Selected</h2>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Go to Search</button>
          </div>
        </div>
      </div>
    );
  }

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const ageDifMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleConfirm = async () => {
    const isValid = passengers.every(p => p.firstName && p.lastName && p.dateOfBirth);
    if (!isValid) {
      setError("Please fill all required details for all passengers"); return;
    }
    setLoading(true); setError("");
    try {
      const userId = localStorage.getItem("userId");
      const payload = {
        userId,
        passengers: passengers.map(p => ({ ...p, age: calculateAge(p.dateOfBirth) })),
        paymentMethod: paymentMethod,
        seatClass: seatClass,
      };
      const bookingId = await createBooking(flight.flightId, payload);
      navigate("/booking/confirmation", {
        state: { bookingId, flight, seatClass, totalAmount: price, passengers }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessPremium = 1.5;
  const baseCost = seatClass === "BUSINESS" ? Number(flight.ticketCost) * businessPremium : Number(flight.ticketCost);
  const price = baseCost * passengers.length;

  return (
    <div className="app-container">
      <Navbar />
      <div className="scroll-area">
        <div className="container booking-container">
          <div className="booking-header">
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-back">
              ← Back to Results
            </button>
            <h1 className="page-title">Finalize Your Journey</h1>
          </div>

          <div className="booking-layout">
            <div className="booking-form-column">
              <div className="glass-card booking-section-card">
                <h3 className="section-label">Flight Summary</h3>
                <div className="flight-summary-row">
                  <div>
                    <div className="flight-time">{formatTime(flight.departureTime)}</div>
                    <div className="flight-place">{flight.fromPlace}</div>
                  </div>
                  <div className="flight-route-center">
                    <div className="flight-number-label">{flight.flightNumber}</div>
                    <div className="flight-line-container">
                      <div className="flight-line-bar">
                        <div className="flight-plane-icon">✈</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flight-time">{formatTime(flight.arrivalTime)}</div>
                    <div className="flight-place">{flight.toPlace}</div>
                  </div>
                </div>
              </div>

              <div className="glass-card booking-section-card">
                <h3 className="card-title">Select Cabin Class</h3>
                <div className="grid grid-cols-2">
                  {["ECONOMY", "BUSINESS"].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSeatClass(cls)}
                      className={`glass-card cabin-option ${seatClass === cls ? "cabin-option-selected" : ""}`}
                    >
                      <div className="cabin-icon">{cls === "ECONOMY" ? "💺" : "👑"}</div>
                      <div className="cabin-name">{cls}</div>
                      <div className="cabin-price">
                        ₹{(cls === "BUSINESS" ? Number(flight.ticketCost) * businessPremium : Number(flight.ticketCost)).toLocaleString("en-IN")} per passenger
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="passengers-column">
                {passengers.map((passenger, index) => (
                  <div key={index} className="glass-card animate-slide-up passenger-card">
                    <div className="passenger-card-header">
                      <h3 className="card-title">Passenger {index + 1} Details</h3>
                      {passengers.length > 1 && (
                        <button className="btn btn-danger btn-xs" onClick={() => removePassenger(index)}>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2">
                      <div className="input-group">
                        <label className="input-label">First Name *</label>
                        <input className="input-field" placeholder="First Name" value={passenger.firstName}
                          onChange={e => updatePassenger(index, "firstName", e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Last Name *</label>
                        <input className="input-field" placeholder="Last Name" value={passenger.lastName}
                          onChange={e => updatePassenger(index, "lastName", e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="input-group">
                        <label className="input-label">Gender</label>
                        <select className="input-field" value={passenger.gender} onChange={e => updatePassenger(index, "gender", e.target.value)}>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Meal Preference</label>
                        <select className="input-field" value={passenger.mealPreference} onChange={e => updatePassenger(index, "mealPreference", e.target.value)}>
                          {MEAL_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="input-group">
                        <label className="input-label">Passport Number (Optional)</label>
                        <input className="input-field" placeholder="Passport No." value={passenger.passportNumber}
                          onChange={e => updatePassenger(index, "passportNumber", e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Date of Birth *</label>
                        <input className="input-field" type="date" value={passenger.dateOfBirth}
                          onChange={e => updatePassenger(index, "dateOfBirth", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}

                <button className="btn btn-ghost add-passenger-btn" onClick={addPassenger}>
                  + Add Another Passenger
                </button>
              </div>

              <div className="glass-card booking-section-card">
                <h3 className="card-title">Payment Method</h3>
                <div className="payment-methods-grid">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.value}
                      onClick={() => setPaymentMethod(pm.value)}
                      className={`payment-method-card ${paymentMethod === pm.value ? "payment-method-selected" : ""}`}
                    >
                      <div className="payment-method-icon">{pm.label.split(" ")[0]}</div>
                      <div className="payment-method-name">{pm.label.substring(pm.label.indexOf(" ") + 1)}</div>
                      <div className="payment-method-desc">{pm.desc}</div>
                      {paymentMethod === pm.value && <div className="payment-method-check">✓</div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="booking-summary-sticky">
              <div className="glass-card booking-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-items">
                  <div className="summary-row">
                    <span className="summary-label">Passengers</span>
                    <span className="summary-value">{passengers.length}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Base Fare ({seatClass})</span>
                    <span className="summary-value">₹{Number(flight.ticketCost).toLocaleString("en-IN")} x {passengers.length}</span>
                  </div>
                  {seatClass === "BUSINESS" && (
                    <div className="summary-row">
                      <span className="summary-label">Cabin Upgrade</span>
                      <span className="summary-value">₹{(Number(flight.ticketCost) * (businessPremium - 1)).toLocaleString("en-IN")} x {passengers.length}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span className="summary-label">Taxes & Fees</span>
                    <span className="summary-value-success">INCLUDED</span>
                  </div>
                </div>

                <div className="summary-total-row">
                  <span className="summary-total-label">Total Amount</span>
                  <span className="summary-total-value">₹{price.toLocaleString("en-IN")}</span>
                </div>

                {error && (
                  <div className="badge badge-danger booking-error-msg">⚠ {error}</div>
                )}

                <button
                  className="btn btn-primary booking-confirm-btn"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Complete Booking →"}
                </button>

                <p className="booking-security-note">
                  🔒 Secure 256-bit SSL Encrypted Payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
