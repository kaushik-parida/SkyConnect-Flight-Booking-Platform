import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { formatTime, formatDate } from "../../utils/dateUtils";
import { AIRPORTS } from "../../constants/airports";

export default function BoardingPassPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookingId, flight, seatClass, totalAmount, passenger } = state || {};

  if (!bookingId || !flight) {
    navigate("/");
    return null;
  }

  const handlePrint = () => window.print();

  const seatNumber = seatClass === "BUSINESS"
    ? `B${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`
    : `${Math.floor(Math.random() * 40) + 10}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;

  const gate = `G${Math.floor(Math.random() * 30) + 1}`;
  const boardingTime = (() => {
    const d = new Date(flight.departureTime);
    d.setMinutes(d.getMinutes() - 45);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  })();

  const getCityCode = (cityName) => {
    if (!cityName) return "---";
    const airport = AIRPORTS.find(a => a.city.toLowerCase() === cityName.toLowerCase());
    return airport ? airport.code : cityName.substring(0, 3).toUpperCase();
  };

  const getAirlineInfo = (flightNumber) => {
    if (!flightNumber) return { name: "SkyConnect Air", logo: "✈", color: "var(--accent)" };
    const prefix = flightNumber.substring(0, 2).toUpperCase();
    switch (prefix) {
      case "6E": return { name: "IndiGo", logo: "https://images.kiwi.com/airlines/64/6E.png", color: "#001B94" };
      case "AI": return { name: "Air India", logo: "https://images.kiwi.com/airlines/64/AI.png", color: "#ED1B24" };
      case "UK": return { name: "Vistara", logo: "https://images.kiwi.com/airlines/64/UK.png", color: "#3B1449" };
      case "SG": return { name: "SpiceJet", logo: "https://images.kiwi.com/airlines/64/SG.png", color: "#F60000" };
      case "QP": return { name: "Akasa Air", logo: "https://images.kiwi.com/airlines/64/QP.png", color: "#FF6A00" };
      case "I5": return { name: "AirAsia India", logo: "https://images.kiwi.com/airlines/64/I5.png", color: "#FF0000" };
      default: return { name: "SkyConnect Air", logo: "✈", color: "var(--accent)" };
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="scroll-area" style={{ display: "flex", flexDirection: "column" }}>
        <div className="container animate-slide-up" style={{ maxWidth: "1200px", paddingBottom: "40px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
            <div>
              <button className="btn btn-ghost" onClick={() => navigate(-1)}
                style={{ marginBottom: "16px", fontSize: "13px", padding: "6px 12px", border: "none", background: "rgba(15,23,42,0.05)" }}>
                ← Back
              </button>
              <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "4px" }}>Boarding Pass</h1>
              <p style={{ color: "var(--text-dim)" }}>Your official SkyConnect boarding pass is ready.</p>
            </div>
            <button className="btn btn-primary" onClick={handlePrint} style={{ gap: "8px" }}>
              🖨 Print Pass
            </button>
          </div>

          <div className="boarding-pass">

            <div className="boarding-pass-main">
              <div className="boarding-pass-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {getAirlineInfo(flight.flightNumber).logo.startsWith("http") ? (
                      <img src={getAirlineInfo(flight.flightNumber).logo} alt="logo" style={{
                        width: "40px", height: "40px", borderRadius: "10px", background: "#fff",
                        padding: "2px", objectFit: "contain"
                      }} />
                    ) : (
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        background: getAirlineInfo(flight.flightNumber).color, display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff"
                      }}>
                        {getAirlineInfo(flight.flightNumber).logo}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "16px", fontFamily: "'Outfit',sans-serif", letterSpacing: "-0.3px" }}>{getAirlineInfo(flight.flightNumber).name}</div>
                      <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "2px", fontWeight: "600" }}>BOARDING PASS</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.08em" }}>PNR / Booking Ref</div>
                    <div style={{ fontWeight: "900", fontSize: "20px", fontFamily: "'Outfit',sans-serif", letterSpacing: "2px" }}>{bookingId}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "44px", fontWeight: "900", fontFamily: "'Outfit',sans-serif", lineHeight: 1, letterSpacing: "-2px" }}>
                      {getCityCode(flight.fromPlace)}
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px", fontWeight: "600" }}>{flight.fromPlace}</div>
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <div style={{ fontSize: "11px", opacity: 0.8, fontWeight: "700" }}>{flight.flightNumber}</div>
                    <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
                      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.3)" }} />
                      <span style={{ fontSize: "18px", flexShrink: 0 }}>✈</span>
                      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.3)" }} />
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
                    </div>
                    <div style={{ fontSize: "10px", opacity: 0.7, fontWeight: "700" }}>NON-STOP</div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "44px", fontWeight: "900", fontFamily: "'Outfit',sans-serif", lineHeight: 1, letterSpacing: "-2px" }}>
                      {getCityCode(flight.toPlace)}
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px", fontWeight: "600" }}>{flight.toPlace}</div>
                  </div>
                </div>
              </div>

              <div className="boarding-pass-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
                  <div>
                    <div className="bp-field-label">Passenger Name</div>
                    <div className="bp-field-value" style={{ fontSize: "18px" }}>
                      {passenger?.firstName ? `${passenger.firstName} ${passenger.lastName}` : "Passenger"}
                    </div>
                  </div>
                  <div>
                    <div className="bp-field-label">Departure</div>
                    <div className="bp-field-value" style={{ fontSize: "18px" }}>{formatTime(flight.departureTime)}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px", fontWeight: "600" }}>{formatDate(flight.departureTime)}</div>
                  </div>
                  <div>
                    <div className="bp-field-label">Cabin Class</div>
                    <div className="bp-field-value" style={{ fontSize: "18px" }}>{seatClass}</div>
                  </div>
                </div>
              </div>

              <div className="boarding-pass-footer">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "36px" }}>
                    <div>
                      <div className="bp-field-label">Arrival Time</div>
                      <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-main)" }}>{formatTime(flight.arrivalTime)}</div>
                    </div>
                    <div>
                      <div className="bp-field-label">Flight Info</div>
                      <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-main)" }}>{flight.flightNumber}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "99px", fontSize: "10px",
                      fontWeight: "800", background: "#16a34a", color: "#ffffff",
                      border: "1px solid #15803d", textTransform: "uppercase", letterSpacing: "0.06em"
                    }}>Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="boarding-pass-divider">
              <div className="boarding-pass-divider-circle top" />
              <div className="boarding-pass-divider-line" />
              <div className="boarding-pass-divider-circle bottom" />
            </div>

            <div className="boarding-pass-stub">
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <div className="bp-field-label">Boarding Time</div>
                    <div className="bp-field-value" style={{ color: "var(--warning)", fontSize: "20px" }}>{boardingTime}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="bp-field-label">Gate</div>
                    <div className="bp-field-value" style={{ color: "var(--accent)", fontSize: "24px" }}>{gate}</div>
                  </div>
                </div>

                <div>
                  <div className="bp-field-label">Seat Assignment</div>
                  <div className="bp-field-value" style={{ color: "var(--text-heading)", fontSize: "24px", marginBottom: "24px" }}>{seatNumber}</div>
                </div>

                <div>
                  <div className="bp-field-label">Amount Paid</div>
                  <div style={{ fontWeight: "900", fontSize: "22px", fontFamily: "'Outfit',sans-serif", color: "#059669" }}>
                    {totalAmount ? `₹${Number(totalAmount).toLocaleString("en-IN")}` : "—"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginTop: "24px" }}>
                <div className="bp-qr" style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#fff", padding: "4px", borderRadius: "8px", border: "1px solid rgba(148,163,184,0.3)", width: "120px", height: "120px" }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PNR:${bookingId},Flight:${flight.flightNumber},Seat:${seatNumber},Date:${formatDate(flight.departureTime)}`}
                    alt="Boarding Pass QR"
                    style={{ width: "110px", height: "110px", display: "block" }}
                  />
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Scan at Gate
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
