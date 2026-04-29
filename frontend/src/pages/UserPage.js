import React from "react";
import Navbar from "../components/Navbar";
import FlightSearch from "../components/FlightSearch";
import userBg from "../assets/user-background.jpg";
function UserPage() {
  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.overlay}>
        <h1 style={styles.heading}>Enjoy Booking</h1>
        <FlightSearch />
      </div>
    </div>
  );
}
const styles = {
  container: {
    backgroundImage: `url(${userBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  },
  overlay: {
    background: "rgba(0,0,0,0.6)",
    minHeight: "100vh",
    paddingTop: "80px",
    textAlign: "center",
  },
  heading: {
    color: "white",
    marginBottom: "20px",
    fontSize: "28px",
  },
};
export default UserPage;