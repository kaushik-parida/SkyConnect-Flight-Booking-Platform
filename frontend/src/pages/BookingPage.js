import React, { useState } from "react";
import { useLocation } from "react-router-dom";
function BookingPage() {
  const { state: flight } = useLocation();
  const [passengerName, setPassengerName] = useState("");
  const [seatType, setSeatType] = useState("ECONOMY");
  if (!flight) return <h2>No flight selected</h2>;
  const handleConfirm = () => {
    if (!passengerName) {
      alert("Enter passenger name");
      return;
    }
    console.log("Booking Data:", {
      passengerName,
      seatType,
      flightId: flight.flightId,
    });
    alert("Booking confirmed!");
  };
  return (
    <div style={styles.container}>
      <h2>Confirm Booking</h2>
      <div style={styles.card}>
        <h3>{flight.airlineName}</h3>
        <p>{flight.from} → {flight.to}</p>
        <p>Departure: {flight.departureTime}</p>
        <p>Price: ₹{flight.price}</p>
        <input
          placeholder="Passenger Name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
          style={styles.input}
        />
        <select
          value={seatType}
          onChange={(e) => setSeatType(e.target.value)}
          style={styles.input}
        >
          <option>ECONOMY</option>
          <option>BUSINESS</option>
        </select>
        <button style={styles.button} onClick={handleConfirm}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
const styles = {
  container: { padding: "30px", textAlign: "center" },
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "400px",
    margin: "auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    padding: "10px",
    background: "#0071c2",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
};

export default BookingPage;