import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights } from "../services/api";
const places = ["Bangalore","Delhi","Mumbai","Chennai","Hyderabad","Kolkata","Paris","Germany"];
const FlightSearch = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
  });
  const [flights, setFlights] = useState([]); 
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [results, setResults] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const handleSearch = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      showMessage("Please login to continue with your booking");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    if (!form.from || !form.to || !form.departureDate) {
      showMessage("Please fill all required fields");
      return;
    }
    if (form.from === form.to) {
      showMessage("From and To cannot be same");
      return;
    }
    if (form.departureDate < today) {
      showMessage("Departure date cannot be in the past");
      return;
    }
    if (form.returnDate && form.returnDate < form.departureDate) {
      showMessage("Return date cannot be before departure date");
      return;
    }
    try {
      showMessage("Searching flights...", "success");
      const data = await searchFlights(form);
      console.log("Flights:", data);
      setFlights(data);
      showMessage("Flights loaded successfully", "success");
      navigate("/results", { state: data });
    } catch (error) {
      console.error(error);
      showMessage("Failed to fetch flights");
    }
  };
  const renderFlightCard = (flight) => (
    <div key={flight.flightId} style={styles.flightCard}>
      <div>
        <h4 style={styles.flightNo}>{flight.flightNumber}</h4>
        <p style={styles.airline}>SkyConnect</p>
      </div>
      <div style={styles.timeBox}>
        <h3>{flight.departureTime.slice(11, 16)}</h3>
        <p>{flight.fromPlace}</p>
      </div>
      <div style={styles.durationBox}>
        <p>
          {flight.departureTime.slice(11, 16)} -{" "}
          {flight.arrivalTime.slice(11, 16)}
        </p>
      </div>
      <div style={styles.timeBox}>
        <h3>{flight.arrivalTime.slice(11, 16)}</h3>
        <p>{flight.toPlace}</p>
      </div>
      <div style={styles.priceBox}>
        <h3>₹{flight.ticketCost}</h3>
        <button style={styles.bookBtn}>Book</button>
      </div>
    </div>
  );
  return (
    <div style={styles.container}>
      {message && (
        <div
          style={
            messageType === "error"
              ? styles.toastError
              : styles.toastSuccess
          }
        >
          {message}
        </div>
      )}
      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>From</label>
          <select name="from" onChange={handleChange} style={styles.input}>
            <option value="">Select city</option>
            {places.map((place) => (
              <option key={place}>{place}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>To</label>
          <select name="to" onChange={handleChange} style={styles.input}>
            <option value="">Select city</option>
            {places.map((place) => (
              <option key={place}>{place}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Departure Date</label>
          <input
            type="date"
            name="departureDate"
            min={today}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Return Date</label>
          <input
            type="date"
            name="returnDate"
            min={form.departureDate || today}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button style={styles.button} onClick={handleSearch}>
          Search Flights
        </button>
      </div>
      {results && results.onwardFlights.length > 0 && (
        <div style={styles.results}>
          <h3 style={styles.resultTitle}>Onwards Flights</h3>
          {results.onwardFlights.map((flight) => renderFlightCard(flight))}
        </div>
      )}
      {results && results.returnFlights.length > 0 && (
        <div style={styles.results}>
          <h3 style={styles.resultTitle}>Return Flights</h3>
          {results.returnFlights.map((flight) => renderFlightCard(flight))}
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
    background: "#0b2c4a",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "900px",
    margin: "50px auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "white",
    marginBottom: "5px",
    fontSize: "14px",
  },
  input: {
    height: "45px",
    padding: "0 12px",
    borderRadius: "10px",
    border: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    gridColumn: "span 4",
    background: "#0071c2",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  toastError: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#ff4d4f",
    color: "white",
    padding: "12px 18px",
    borderRadius: "8px",
    zIndex: 999,
  },
  toastSuccess: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#52c41a",
    color: "white",
    padding: "12px 18px",
    borderRadius: "8px",
    zIndex: 999,
  },
  results: {
    background: "white",
    marginTop: "25px",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "left",
  },
  resultTitle: {
    color: "#0b2c4a",
    marginBottom: "15px",
  },
  flightCard: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1.5fr 1fr 1fr",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "16px",
    marginTop: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  flightNo: {
    margin: 0,
    color: "#0b2c4a",
  },
  airline: {
    margin: "4px 0 0",
    color: "#777",
    fontSize: "13px",
  },
  timeBox: {
    textAlign: "center",
  },
  priceBox: {
    textAlign: "right",
  },
  bookBtn: {
    background: "#0071c2",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  durationBox: {
    textAlign: "center",
    color: "#666",
    fontSize: "13px",
  },

};
export default FlightSearch;