import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { createBooking } from "../../services/api";
import { formatTime } from "../../utils/dateUtils";

const MEAL_OPTIONS = ["VEG", "NON_VEG", "NONE"];

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flight;

  const [seatClass, setSeatClass] = useState("ECONOMY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [passengers, setPassengers] = useState([{
    firstName: "", lastName: "", gender: "MALE",
    passportNumber: "", dateOfBirth: "", mealPreference: "VEG"
  }]);

  const [payment, setPayment] = useState({
    paymentMethod: "CARD",
  });

  const updatePassenger = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, {
      firstName: "", lastName: "", gender: "MALE",
      passportNumber: "", dateOfBirth: "", mealPreference: "VEG"
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
        <div className="scroll-area" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
            <h2 style={{ marginBottom: "20px" }}>No Flight Selected</h2>
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
      const payload = {
        passengers: passengers.map(p => ({ ...p, age: calculateAge(p.dateOfBirth) })),
        paymentMethod: payment.paymentMethod,
        seatClass: seatClass,
      };
      const bookingId = await createBooking(flight.flightId, payload);
      navigate("/booking/confirmation", { state: { bookingId, flight, seatClass, totalAmount: price, passenger: passengers[0] } });
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
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div style={{ marginBottom: "32px" }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "13px", marginBottom: "16px" }}>
              ← Back to Results
            </button>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-heading)" }}>Finalize Your Journey</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="glass-card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Flight Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-heading)" }}>{formatTime(flight.departureTime)}</div>
                    <div style={{ fontWeight: "600", color: "var(--text-dim)" }}>{flight.fromPlace}</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1, padding: "0 40px" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{flight.flightNumber}</div>
                    <div style={{ height: "1px", background: "var(--glass-border)", position: "relative" }}>
                      <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", fontSize: "16px" }}>✈</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-heading)" }}>{formatTime(flight.arrivalTime)}</div>
                    <div style={{ fontWeight: "600", color: "var(--text-dim)" }}>{flight.toPlace}</div>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "16px", color: "var(--text-heading)", marginBottom: "20px" }}>Select Cabin Class</h3>
                <div className="grid grid-cols-2">
                  {["ECONOMY", "BUSINESS"].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSeatClass(cls)}
                      className="glass-card"
                      style={{
                        padding: "20px",
                        textAlign: "left",
                        cursor: "pointer",
                        borderWidth: "2px",
                        borderColor: seatClass === cls ? "var(--accent)" : "var(--glass-border)",
                        background: seatClass === cls ? "rgba(61, 90, 254, 0.1)" : "transparent"
                      }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{cls === "ECONOMY" ? "💺" : "👑"}</div>
                      <div style={{ fontWeight: "800", color: "var(--text-heading)", textTransform: "uppercase", fontSize: "14px" }}>{cls}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
                        ₹{(cls === "BUSINESS" ? Number(flight.ticketCost) * businessPremium : Number(flight.ticketCost)).toLocaleString("en-IN")} per passenger
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {passengers.map((passenger, index) => (
                  <div key={index} className="glass-card animate-slide-up" style={{ padding: "28px", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                      <h3 style={{ fontSize: "16px", color: "var(--text-heading)" }}>Passenger {index + 1} Details</h3>
                      {passengers.length > 1 && (
                        <button className="btn btn-danger" onClick={() => removePassenger(index)} style={{ padding: "4px 12px", fontSize: "12px" }}>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2">
                      <div className="input-group">
                        <label className="input-label">First Name *</label>
                        <input className="input-field" placeholder="First Name" value={passenger.firstName}
                          onChange={e => updatePassenger(index, 'firstName', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Last Name *</label>
                        <input className="input-field" placeholder="Last Name" value={passenger.lastName}
                          onChange={e => updatePassenger(index, 'lastName', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="input-group">
                        <label className="input-label">Gender</label>
                        <select className="input-field" value={passenger.gender} onChange={e => updatePassenger(index, 'gender', e.target.value)}>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Meal Preference</label>
                        <select className="input-field" value={passenger.mealPreference} onChange={e => updatePassenger(index, 'mealPreference', e.target.value)}>
                          {MEAL_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="input-group">
                        <label className="input-label">Passport Number (Optional)</label>
                        <input className="input-field" placeholder="Passport No." value={passenger.passportNumber}
                          onChange={e => updatePassenger(index, 'passportNumber', e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Date of Birth *</label>
                        <input className="input-field" type="date" value={passenger.dateOfBirth}
                          onChange={e => updatePassenger(index, 'dateOfBirth', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}

                <button className="btn btn-ghost" onClick={addPassenger} style={{ width: "100%", padding: "16px", borderStyle: "dashed" }}>
                  + Add Another Passenger
                </button>
              </div>
            </div>

            <div style={{ position: "sticky", top: "0" }}>
              <div className="glass-card" style={{ padding: "32px", borderTop: "4px solid var(--accent)" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-heading)", marginBottom: "24px" }}>Order Summary</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-dim)" }}>Passengers</span>
                    <span style={{ color: "var(--text-heading)", fontWeight: "600" }}>{passengers.length}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-dim)" }}>Base Fare ({seatClass})</span>
                    <span style={{ color: "var(--text-heading)", fontWeight: "600" }}>₹{Number(flight.ticketCost).toLocaleString("en-IN")} x {passengers.length}</span>
                  </div>
                  {seatClass === "BUSINESS" && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ color: "var(--text-dim)" }}>Cabin Upgrade</span>
                      <span style={{ color: "var(--text-heading)", fontWeight: "600" }}>₹{(Number(flight.ticketCost) * (businessPremium - 1)).toLocaleString("en-IN")} x {passengers.length}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-dim)" }}>Taxes & Fees</span>
                    <span style={{ color: "var(--success)", fontWeight: "700" }}>INCLUDED</span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "20px", marginBottom: "32px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-heading)" }}>Total Amount</span>
                    <span style={{ fontSize: "28px", fontWeight: "800", color: "var(--cyan)" }}>₹{price.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {error && <div className="badge badge-danger" style={{ width: "100%", padding: "12px", marginBottom: "20px", textAlign: "center", whiteSpace: "normal", lineHeight: "1.4" }}>⚠ {error}</div>}

                <button
                  className="btn btn-primary"
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{ width: "100%", height: "56px", fontSize: "16px" }}
                >
                  {loading ? "Processing..." : "Complete Booking →"}
                </button>

                <div style={{ marginTop: "24px", textAlign: "center" }}>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    🔒 Secure 256-bit SSL Encrypted Payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
