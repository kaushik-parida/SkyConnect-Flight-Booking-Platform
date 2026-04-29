import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login-background.jpg";

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSignup = () => {
    if (!email || !password) {
      showMessage("Please enter email and password");
      return;
    }

    if (!email.includes("@")) {
      showMessage("Enter a valid email");
      return;
    }

    if (password.length < 4) {
      showMessage("Password must be at least 4 characters");
      return;
    }

    console.log("Signup:", email, password);

    showMessage("User registered successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={styles.title}>Signup</h2>

          {message && <div style={styles.message}>{message}</div>}

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

          <button style={styles.button} onClick={handleSignup}>
            Signup
          </button>

          <p style={styles.text}>
            Already have an account?{" "}
            <span style={styles.link} onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundImage: `url(${loginBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  },
  overlay: {
    background: "rgba(0,0,0,0.6)",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#0071c2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  link: {
    color: "#0071c2",
    cursor: "pointer",
    fontWeight: "bold",
  },
  text: {
    marginTop: "10px",
  },
  message: {
    background: "#ff4d4f",
    color: "white",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "10px",
  },
};

export default SignupPage;