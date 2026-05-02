import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const flights = location.state || [];
  return (
    <div style={styles.container}>
      <h2>Available Flights</h2>
      {flights.length === 0 ? (
        <p>No Flights Found</p>
      ) : (
        flights.map((f, index) => (
          <div key={index} style={styles.card}>
            <h4>{f.airlineName}</h4>

            <p>{f.from} → {f.to}</p>
            <p>Departure: {f.departureTime}</p>
            <p>Price: ₹{f.price}</p>
            <button
              style={styles.button}
              onClick={() =>
                navigate("/booking", { state: f })
              }
            >
              Book Now
            </button>
          </div>
        ))
      )}
    </div>
  );
}
const styles = {
  container: {
    padding: "20px",
  },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    background: "#f9f9f9",
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#0071c2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
export default ResultsPage;