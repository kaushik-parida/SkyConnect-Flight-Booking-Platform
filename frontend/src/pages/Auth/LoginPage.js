import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login as loginApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PANEL_FEATURES = [
  { icon: "⚡", title: "Instant Confirmation", desc: "Get your booking confirmed in seconds." },
  { icon: "🛡️", title: "Secure Payments", desc: "256-bit SSL encryption on all transactions." },
  { icon: "🌍", title: "100+ Routes", desc: "Pan-India network covering every major city." },
  { icon: "🎫", title: "Easy Cancellations", desc: "Hassle-free cancellations with one click." },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectFlight = location.state?.redirectFlight;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.usernameOrEmail || !form.password) { setError("Please enter your email and password"); return; }
    setLoading(true); setError("");
    try {
      const res = await loginApi(form);
      login(res.data);
      if (redirectFlight) {
        navigate("/booking", { state: { flight: redirectFlight } });
      } else {
        navigate(res.data.role === "ADMIN" ? "/admin" : "/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout">
      <div className="split-form-side">
        <div className="animate-scale-in" style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ marginBottom: "40px" }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "32px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "13px",
                background: "linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
                boxShadow: "var(--shadow-accent)",
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </div>
              <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-heading)", fontFamily: "'Outfit',sans-serif" }}>
                Sky<span style={{ color: "var(--accent)" }}>Connect</span>
              </span>
            </Link>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.5px" }}>Welcome back</h1>
            <p style={{ color: "var(--text-dim)", fontSize: "15px" }}>
              {redirectFlight
                ? `Sign in to book ${redirectFlight.fromPlace} → ${redirectFlight.toPlace}`
                : "Sign in to continue to your account."}
            </p>
          </div>

          {error && (
            <div className="badge badge-danger" style={{ width: "100%", padding: "11px 16px", marginBottom: "20px", borderRadius: "10px", fontSize: "12px" }}>
              ⚠ {error}
            </div>
          )}

          {redirectFlight && !error && (
            <div className="badge badge-info" style={{ width: "100%", padding: "11px 16px", marginBottom: "20px", borderRadius: "10px", fontSize: "12px" }}>
              ✈ Sign in to complete your booking
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className="input-field" name="usernameOrEmail" type="email"
                placeholder="you@example.com" value={form.usernameOrEmail}
                onChange={handleChange} autoComplete="email" />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input-field" name="password" type="password"
                placeholder="••••••••" value={form.password}
                onChange={handleChange} autoComplete="current-password" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: "100%", height: "50px", marginTop: "8px", fontSize: "15px" }}>
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--glass-border)" }}>
            <span style={{ fontSize: "13px" }}>🔒</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              256-bit Encrypted Session
            </span>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-dim)" }}>
            No account?{" "}
            <Link to="/signup" style={{ color: "var(--accent)", fontWeight: "700", textDecoration: "none" }}>
              Create one →
            </Link>
          </p>
        </div>
      </div>

      <div className="split-panel-side">
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ fontSize: "56px", marginBottom: "24px" }}>✈</div>
          <h2 style={{ fontSize: "36px", fontWeight: "900", color: "#fff", lineHeight: 1.15, marginBottom: "16px", fontFamily: "'Outfit',sans-serif", letterSpacing: "-1px" }}>
            India's Smartest<br />Flight Booking
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", marginBottom: "48px", lineHeight: 1.7 }}>
            Real-time availability, smart pricing, and instant confirmation — all in one place.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {PANEL_FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                  background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: "700", color: "#fff", fontSize: "15px", marginBottom: "3px" }}>{f.title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
