import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const role = localStorage.getItem("role");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div style={styles.nav}>
      <h2 style={{ color: "white" }}>Enjoy Trip</h2>

      <div>
        {!isLoggedIn ? (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
          </>
        ) : (
          <>
            {role === "ADMIN" && (
              <button onClick={() => navigate("/admin")}>Admin</button>
            )}
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#0b2c4a",
  },
};

export default Navbar;