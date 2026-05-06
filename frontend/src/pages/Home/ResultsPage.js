import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { formatTime, formatDate, calcDuration, formatFullDate } from "../../utils/dateUtils";

function FlightCard({ flight, onBook }) {
  return (
    <div className="glass-card glass-card-hover animate-slide-up" style={{
      padding: "24px",
      display: "grid",
      gridTemplateColumns: "1.2fr 2fr 1.2fr",
      alignItems: "center",
      gap: "24px",
      marginBottom: "16px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ 
          width: "48px", height: "48px", borderRadius: "12px", 
          background: "linear-gradient(135deg, var(--accent), var(--purple))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", color: "#fff", boxShadow: "var(--shadow-accent)"
        }}>✈</div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "16px", color: "var(--white)" }}>{flight.flightNumber}</div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>SkyConnect Signature</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "20px", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--white)" }}>{formatTime(flight.departureTime)}</div>
          <div style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: "600" }}>{flight.fromPlace}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatDate(flight.departureTime)}</div>
        </div>

        <div style={{ textAlign: "center", minWidth: "100px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>{calcDuration(flight.departureTime, flight.arrivalTime)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--accent), var(--cyan))" }} />
            <div style={{ fontSize: "14px" }}>✈</div>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--cyan), var(--purple))" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--purple)" }} />
          </div>
          <div style={{ fontSize: "10px", color: "var(--accent)", fontWeight: "700", marginTop: "4px", textTransform: "uppercase" }}>Non-stop</div>
        </div>

        <div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--white)" }}>{formatTime(flight.arrivalTime)}</div>
          <div style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: "600" }}>{flight.toPlace}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatDate(flight.arrivalTime)}</div>
        </div>
      </div>

      <div style={{ textAlign: "right", borderLeft: "1px solid var(--glass-border)", paddingLeft: "24px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px" }}>Best Fare</div>
        <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--cyan)", margin: "4px 0 12px" }}>₹{Number(flight.ticketCost).toLocaleString("en-IN")}</div>
        <button className="btn btn-primary" onClick={() => onBook(flight)} style={{ padding: "10px 24px", fontSize: "14px" }}>
          Select Flight
        </button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, searchParams } = location.state || {};

  if (!results) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="scroll-area" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ padding: "40px", textAlign: "center", maxWidth: "400px" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>✈</div>
            <h2 style={{ marginBottom: "12px" }}>No Flights Found</h2>
            <p style={{ color: "var(--text-dim)", marginBottom: "32px" }}>Try adjusting your dates or locations to find available flights.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Modify Search</button>
          </div>
        </div>
      </div>
    );
  }

  const onBook = (flight) => navigate("/booking", { state: { flight } });
  const hasReturn = results.returnFlights?.length > 0;

  return (
    <div className="app-container">
      <Navbar />
      <div className="scroll-area">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "800", color: "var(--white)", marginBottom: "4px" }}>
                {searchParams?.fromPlace} <span style={{ color: "var(--accent)" }}>→</span> {searchParams?.toPlace}
              </h1>
              <p style={{ color: "var(--text-dim)", fontWeight: "600" }}>
                {formatFullDate(searchParams?.departureDate)}
                {" · "}{searchParams?.tripType === "ROUND_TRIP" ? "Round Trip" : "One Way"}
              </p>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate("/")}>
              Modify Search
            </button>
          </div>

          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <span className="badge badge-success" style={{ padding: "6px 12px" }}>Departure Flights</span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{results.onwardFlights?.length} options available</span>
            </div>
            {results.onwardFlights?.map((f) => <FlightCard key={f.flightId} flight={f} onBook={onBook} />)}
          </div>

          {hasReturn && (
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <span className="badge badge-warning" style={{ padding: "6px 12px" }}>Return Flights</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{results.returnFlights?.length} options available</span>
              </div>
              {results.returnFlights?.map((f) => <FlightCard key={f.flightId} flight={f} onBook={onBook} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
