import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if(!email || !password){
      setMessage("Please enter email and password");
      return;
    }
  const role = email === "admin@gmail.com" ? "ADMIN" : "USER";
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", role);
  if (role === "ADMIN") {
    navigate("/admin");
  } else {
    navigate("/");
  }
};
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        {message && (
          <div style={styles.message}>{message}</div>
        )}
        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1e3c72",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
  },
  link: {
    color: "blue",
    cursor: "pointer",
  }
};
export default LoginPage;