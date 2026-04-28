import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");
  const handleLogout = () =>{
    localStorage.clear();
    navigate("/");
  };
  return (
    <div style={styles.nav}>
      <h2 style={{ color: "white",cursor:"pointer"}} onClick={()=> navigate("/")}>Enjoy Trip</h2>
      <div>
        {isLoggedIn && role === "ADMIN" && (
          <button style={styles.btn} onClick={()=> navigate("/admin")}>Admin</button>
        )}
        {!isLoggedIn ? (
      <>
     <button style={styles.btn} onClick={() => navigate("/login")}>
      Login
    </button>
    <button style={styles.btn} onClick={() => navigate("/signup")}>
      Signup
    </button>
  </>
) : (
  <button style={styles.btn} onClick={handleLogout}>
    Logout
  </button>
)}
      </div>
    </div>
  );
};
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#0b2c4a",
  },
  btn: {
    padding: "8px 15px",
    background: "white",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft:"10px",
  },
};
export default Navbar;