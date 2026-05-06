import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.usernameOrEmail || !form.password) { setError("Please enter email and password"); return; }
    setLoading(true); setError("");
    try {
      const res = await loginApi(form);
      const loginData = res.data;
      
      // Use AuthContext to manage session
      login(loginData);
      
      navigate(loginData.role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="animate-slide-up" style={{ width: "100%", maxWidth: "420px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{
              width: 50, height: 50, borderRadius: "14px",
              background: "linear-gradient(135deg, var(--accent), var(--cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 800, color: "#fff",
              boxShadow: "var(--shadow-accent)"
            }}>✈</div>
            <span style={{ fontSize: 32, fontWeight: 800, color: "var(--white)", letterSpacing: "-1px" }}>
              Sky<span style={{ color: "var(--cyan)" }}>Connect</span>
            </span>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "16px" }}>Experience the future of flight booking.</p>
        </div>

        <div className="glass-card" style={{ padding: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "8px", color: "var(--white)" }}>Welcome Back</h2>
          <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: "32px" }}>Please enter your details to sign in.</p>

          {error && (
            <div className="badge badge-danger" style={{ width: "100%", padding: "10px", marginBottom: "20px", textAlign: "center" }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                className="input-field" 
                name="usernameOrEmail" 
                type="email" 
                placeholder="you@example.com" 
                value={form.usernameOrEmail} 
                onChange={handleChange} 
                autoComplete="email" 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                className="input-field" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={handleChange} 
                autoComplete="current-password" 
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", height: "54px", marginTop: "12px" }}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "32px", textAlign: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "24px" }}>
            <p style={{ fontSize: "14px", color: "var(--text-dim)" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "var(--cyan)", fontWeight: "700", textDecoration: "none" }}>
                Join SkyConnect →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
