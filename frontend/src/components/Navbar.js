import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <div style={styles.nav}>
      <h2 style={{ color: "white" }}>Enjoy Trip</h2>
      <div>
        {!isLoggedIn ? (
          <button style={styles.btn} onClick={() => navigate("/")}>
            Login
          </button>
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
  },
};

export default Navbar;