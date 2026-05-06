import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { formatTime, formatDate, calcDuration, formatFullDate } from "../../utils/dateUtils";

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
function SmartBadge({ flights, flight }) {
  const minPrice = Math.min(...flights.map(f => f.ticketCost));
  const minDuration = Math.min(...flights.map(f => new Date(f.arrivalTime) - new Date(f.departureTime)));
  const thisDuration = new Date(flight.arrivalTime) - new Date(flight.departureTime);

  if (flight.ticketCost === minPrice) return <span className="badge badge-best">★ Best Value</span>;
  if (thisDuration === minDuration) return <span className="badge badge-fastest">⚡ Fastest</span>;
  return null;
}

function FlightCard({ flight, allFlights, onBook, delay = 0 }) {
  const duration = calcDuration(flight.departureTime, flight.arrivalTime);
  const availableSeats = flight.economySeats ?? "—";

  return (
    <div
      className="glass-card glass-card-hover animate-slide-up"
      style={{
        padding: "0",
        overflow: "hidden",
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1.1fr 2.2fr 1.1fr", alignItems: "center", gap: "20px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {getAirlineInfo(flight.flightNumber).logo.startsWith("http") ? (
            <img src={getAirlineInfo(flight.flightNumber).logo} alt="airline logo" style={{
              width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0,
              objectFit: "contain", background: "#fff", padding: "4px", border: "1px solid var(--glass-border)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }} />
          ) : (
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0,
              background: `linear-gradient(135deg, ${getAirlineInfo(flight.flightNumber).color} 0%, rgba(0,0,0,0.8) 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              fontSize: "22px", boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}>{getAirlineInfo(flight.flightNumber).logo}</div>
          )}
          <div>
            <div style={{ fontWeight: "800", fontSize: "15px", color: "var(--text-main)" }}>{flight.flightNumber}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", fontWeight: "700" }}>{getAirlineInfo(flight.flightNumber).name}</div>
            <SmartBadge flights={allFlights} flight={flight} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "30px", fontWeight: "900", color: "var(--text-main)", fontFamily: "'Outfit', sans-serif", lineHeight: 1, letterSpacing: "-1px" }}>
              {formatTime(flight.departureTime)}
            </div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--accent)", marginTop: "4px" }}>{flight.fromPlace}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{formatDate(flight.departureTime)}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "0 8px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", letterSpacing: "0.05em" }}>{duration}</div>
            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px" }}>
              <div className="flight-timeline-dot flight-timeline-dot-dep" />
              <div className="flight-timeline-line" />
              <span style={{ fontSize: "16px", flexShrink: 0 }}>✈</span>
              <div className="flight-timeline-line" />
              <div className="flight-timeline-dot flight-timeline-dot-arr" />
            </div>
            <div style={{ fontSize: "10px", color: "var(--success)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em" }}>Non-stop</div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "30px", fontWeight: "900", color: "var(--text-main)", fontFamily: "'Outfit', sans-serif", lineHeight: 1, letterSpacing: "-1px" }}>
              {formatTime(flight.arrivalTime)}
            </div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--cyan)", marginTop: "4px" }}>{flight.toPlace}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{formatDate(flight.arrivalTime)}</div>
          </div>
        </div>

        <div style={{ textAlign: "right", borderLeft: "1px solid var(--glass-border)", paddingLeft: "24px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>From</div>
          <div style={{ fontSize: "32px", fontWeight: "900", color: "var(--text-main)", fontFamily: "'Outfit', sans-serif", letterSpacing: "-1px", margin: "4px 0 14px" }}>
            ₹<span style={{ background: "linear-gradient(135deg, var(--accent), var(--cyan))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{Number(flight.ticketCost).toLocaleString("en-IN")}</span>
          </div>
          <button className="btn btn-primary" onClick={() => onBook(flight)} style={{ width: "100%", padding: "11px 20px", fontSize: "13px" }}>
            Select →
          </button>
        </div>
      </div>

      <div style={{
        background: "var(--glass-light)",
        borderTop: "1px solid var(--glass-border)",
        padding: "10px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: "24px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>
            Economy Seats: <span style={{ color: availableSeats < 10 ? "var(--danger)" : "var(--success)", fontWeight: "800" }}>{availableSeats} left</span>
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>
            Business: <span style={{ color: "var(--text-dim)", fontWeight: "800" }}>{flight.businessSeats ?? "—"} left</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <span className="badge badge-info" style={{ fontSize: "9px", padding: "3px 8px" }}>Economy</span>
          <span className="badge badge-accent" style={{ fontSize: "9px", padding: "3px 8px" }}>Business</span>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { results, searchParams } = location.state || {};
  const [sortOption, setSortOption] = useState("PRICE_LOW");

  const sortFlights = (flights) => {
    return [...flights].sort((a, b) => {
      if (sortOption === "PRICE_LOW") return a.ticketCost - b.ticketCost;
      if (sortOption === "PRICE_HIGH") return b.ticketCost - a.ticketCost;
      if (sortOption === "TIME_EARLY") return new Date(a.departureTime) - new Date(b.departureTime);
      if (sortOption === "TIME_LATE") return new Date(b.departureTime) - new Date(a.departureTime);
      return 0;
    });
  };

  if (!results) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="scroll-area" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card animate-scale-in" style={{ padding: "60px 40px", textAlign: "center", maxWidth: "400px" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>✈</div>
            <h2 style={{ marginBottom: "12px" }}>No Flights Found</h2>
            <p style={{ color: "var(--text-dim)", marginBottom: "28px", lineHeight: "1.6" }}>Try adjusting your search criteria to discover available routes.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Back to Search</button>
          </div>
        </div>
      </div>
    );
  }

  const onBook = (flight) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectFlight: flight } });
      return;
    }
    navigate("/booking", { state: { flight } });
  };
  const onwardFlights = results.onwardFlights || [];
  const returnFlights = results.returnFlights || [];
  const hasReturn = returnFlights.length > 0;

  return (
    <div className="app-container">
      <Navbar />
      <div className="scroll-area">
        <div className="container" style={{ maxWidth: "1200px" }}>

          <div className="animate-slide-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px" }}>
            <div>
              <div className="badge badge-info" style={{ marginBottom: "12px" }}>Live Availability</div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1.1, color: "var(--text-main)", fontFamily: "'Outfit', sans-serif" }}>
                {searchParams?.fromPlace} <span style={{ color: "var(--accent)" }}>→</span> {searchParams?.toPlace}
              </h1>
              <p style={{ color: "var(--text-dim)", fontWeight: "500", marginTop: "6px" }}>
                {formatFullDate(searchParams?.departureDate)} · {searchParams?.tripType === "ROUND_TRIP" ? "Round Trip" : "One Way"}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <div className="glass-card" style={{ padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: "900", color: "var(--accent)", fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{onwardFlights.length}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "2px" }}>Flights Found</div>
              </div>
              <button className="btn btn-ghost" onClick={() => navigate("/")} style={{ fontSize: "12px", padding: "7px 14px" }}>
                ← Modify Search
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Sort By:</span>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { id: "PRICE_LOW", label: "Price: Low to High" },
                { id: "PRICE_HIGH", label: "Price: High to Low" },
                { id: "TIME_EARLY", label: "Departure: Earliest" },
                { id: "TIME_LATE", label: "Departure: Latest" }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortOption(opt.id)}
                  style={{
                    padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                    border: "1px solid", transition: "var(--transition)",
                    borderColor: sortOption === opt.id ? "var(--accent)" : "var(--glass-border)",
                    background: sortOption === opt.id ? "rgba(61, 90, 254, 0.1)" : "transparent",
                    color: sortOption === opt.id ? "var(--white)" : "var(--text-dim)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "48px" }}>
            {onwardFlights.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span className="badge badge-success" style={{ padding: "6px 14px" }}>✈ Departure Flights</span>
                <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sortFlights(onwardFlights).map((f, i) => (
                <FlightCard key={f.flightId} flight={f} allFlights={onwardFlights} onBook={onBook} delay={i * 80} />
              ))}
              {onwardFlights.length === 0 && (
                <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                  <h3 style={{ marginBottom: "8px" }}>No flights available</h3>
                  <p style={{ color: "var(--text-dim)" }}>Try a different date or route.</p>
                </div>
              )}
            </div>
          </div>

          {hasReturn && (
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span className="badge badge-warning" style={{ padding: "6px 14px" }}>⇄ Return Flights</span>
                <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {sortFlights(returnFlights).map((f, i) => (
                  <FlightCard key={f.flightId} flight={f} allFlights={returnFlights} onBook={onBook} delay={i * 80} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
