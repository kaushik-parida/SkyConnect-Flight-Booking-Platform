import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const places = [
  "Bangalore",
  "Delhi",
  "Mumbai",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Paris",
  "Germany",
];
const FlightSearch = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const today = new Date().toISOString().split("T")[0];
  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSearch = () => {
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
    console.log("Search Data:", form);
    showMessage("Searching flights...", "success");
  };
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
            {places.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>To</label>
          <select name="to" onChange={handleChange} style={styles.input}>
            <option value="">Select city</option>
            {places.map((p) => (
              <option key={p}>{p}</option>
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
  title: {
    color: "white",
    marginBottom: "20px",
    textAlign: "center",
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
};
export default FlightSearch;