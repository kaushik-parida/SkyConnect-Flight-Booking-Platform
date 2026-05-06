import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/api";

const STEPS_INFO = [
  { icon: "👤", text: "Create your traveller profile" },
  { icon: "🔒", text: "Secured with enterprise-grade encryption" },
  { icon: "⚡", text: "Start booking flights instantly" },
  { icon: "🎫", text: "Manage all your trips in one place" },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", phoneNumber: "",
    gender: "MALE", dateOfBirth: "", role: "USER"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.dateOfBirth) {
      setError("Please fill all required fields"); return;
    }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="split-layout" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <div className="animate-scale-in glass-card" style={{ padding: "60px 48px", textAlign: "center", maxWidth: "440px" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
            <h2 style={{ marginBottom: "12px" }}>Account Created!</h2>
            <p style={{ color: "var(--text-dim)" }}>Redirecting you to sign in...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="split-layout">
      <div className="split-form-side">
        <div className="animate-scale-in" style={{ width: "100%", maxWidth: "440px" }}>
          <div style={{ marginBottom: "28px" }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "24px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: "linear-gradient(135deg, var(--accent), var(--cyan))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                boxShadow: "var(--shadow-accent)",
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </div>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-heading)", fontFamily: "'Outfit',sans-serif" }}>
                Sky<span style={{ color: "var(--accent)" }}>Connect</span>
              </span>
            </Link>
            <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" }}>Create your account</h1>
            <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>Fill in the details below to get started.</p>
          </div>

          {error && (
            <div className="badge badge-danger" style={{ width: "100%", padding: "10px 14px", marginBottom: "16px", borderRadius: "10px", fontSize: "12px" }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input className="input-field" name="fullName" placeholder="Full Name"
                value={form.fullName} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Email *</label>
                <input className="input-field" name="email" type="email" placeholder="Email Address"
                  value={form.email} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Password *</label>
                <input className="input-field" name="password" type="password" placeholder="Min 6 chars"
                  value={form.password} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Phone</label>
                <input className="input-field" name="phoneNumber" placeholder="+91 9999999999"
                  value={form.phoneNumber} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Date of Birth *</label>
                <input className="input-field" type="date" name="dateOfBirth"
                  value={form.dateOfBirth} onChange={handleChange} style={{ colorScheme: "dark" }} />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Gender</label>
                <select className="input-field" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Account Type</label>
                <select className="input-field" name="role" value={form.role} onChange={handleChange}>
                  <option value="USER">Standard User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: "100%", height: "50px", marginTop: "4px", fontSize: "15px" }}>
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--text-dim)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)", fontWeight: "700", textDecoration: "none" }}>
              Sign In →
            </Link>
          </p>
        </div>
      </div>

      <div className="split-panel-side">
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ fontSize: "52px", marginBottom: "20px" }}>🚀</div>
          <h2 style={{ fontSize: "34px", fontWeight: "900", color: "#fff", lineHeight: 1.2, marginBottom: "14px", fontFamily: "'Outfit',sans-serif", letterSpacing: "-1px" }}>
            Join 10,000+<br />Happy Travellers
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "44px", lineHeight: 1.7 }}>
            Book smarter, travel better. SkyConnect gives you real-time prices, instant booking, and full trip management.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {STEPS_INFO.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                  background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
                }}>{s.icon}</div>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
