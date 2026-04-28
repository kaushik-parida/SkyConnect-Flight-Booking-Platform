import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const places = ["Bangalore","Delhi","Mumbai","Chennai","Hyderbad","Kolkata","Paris","Germany"];
const FlightSearch = () =>{
  const navigate = useNavigate();
  const [form,setForm] = useState({
    from : "",
    to : "",
    departureDate : "",
    returnDate:"",
    seatType : "ECONOMY",
  });
  const handleChange = (e) =>{
    setForm({...form,[e.target.name]:e.target.value});
  };
  const handleSearch = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    alert("Please login to continue with your booking");
    navigate("/login");
    return;
  }
  if (!form.from || !form.to || !form.departureDate) {
    alert("Please fill all required fields");
    return;
  }
  if (form.from === form.to) {
    alert("From and To cannot be same");
    return;
  }
  if (form.departureDate < today) {
  alert("Departure date cannot be in the past");
  return;
  }
 if (form.returnDate && form.returnDate < form.departureDate) {
  alert("Return date cannot be before departure date");
  return;
 }
  console.log("Search Data:", form);
  alert("Searching flights...");
};
const today = new Date().toISOString().split("T")[0]; 
  return(
    <div style={styles.container}>
      <h2 style={{color:"white",marginBottom:"20px"}}>search flights</h2>
      <div style={styles.grid}>
        <select name="from" onChange={handleChange} style = {styles.input}>
          <option value="">From</option>
          {places.map((p)=>(
            <option key={p}>{p}</option>
          ))}
        </select>
        <select name="to" onChange={handleChange} style = {styles.input}>
          <option value="">To</option>
          {places.map((p)=>(
            <option key={p}>{p}</option>
          ))}
        </select>
        <div style = {styles.field}>
        <label style = {styles.label}>Departure Date</label>
        <input
          type="date"
          name="departureDate"
          min={today}
          onChange={handleChange}
          style={styles.input}/>
          </div>
        <div style ={styles.field}>
        <label style = {styles.label}>Return Date</label>
        <input
          type="date"
          name="returnDate"
          min={form.departureDate || today}
          onChange={handleChange}
          style={styles.input}/>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },
  input: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    background: "#0071c2",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    gridColumn: "span 2",
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
};
export default FlightSearch;