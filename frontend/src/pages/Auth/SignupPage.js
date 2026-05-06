import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phoneNumber: "", gender: "MALE", dateOfBirth: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.dateOfBirth) { setError("Please fill all required fields"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await register(form);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="animate-slide-up" style={{ width: "100%", maxWidth: "540px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "12px",
              background: "linear-gradient(135deg, var(--accent), var(--cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "#fff",
              boxShadow: "var(--shadow-accent)"
            }}>✈</div>
            <span style={{ fontSize: 28, fontWeight: 800, color: "var(--white)", letterSpacing: "-1px" }}>
              Sky<span style={{ color: "var(--cyan)" }}>Connect</span>
            </span>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "15px" }}>Start your journey with us today.</p>
        </div>

        <div className="glass-card" style={{ padding: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "8px", color: "var(--white)" }}>Join SkyConnect</h2>
          <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: "28px" }}>Fill in your details to create a new account.</p>

          {error && <div className="badge badge-danger" style={{ width: "100%", padding: "10px", marginBottom: "20px", textAlign: "center" }}>⚠ {error}</div>}
          {success && <div className="badge badge-success" style={{ width: "100%", padding: "10px", marginBottom: "20px", textAlign: "center" }}>✓ {success}</div>}

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input className="input-field" name="fullName" placeholder="John Doe" value={form.fullName} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input className="input-field" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Password *</label>
                <input className="input-field" name="password" type="password" placeholder="Min 6 chars" value={form.password} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input className="input-field" name="phoneNumber" placeholder="+91 9999999999" value={form.phoneNumber} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Date of Birth *</label>
                <input className="input-field" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} style={{ colorScheme: "dark" }} />
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
                <select className="input-field" name="role" value={form.role || "USER"} onChange={handleChange}>
                  <option value="USER">Standard User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", height: "54px", marginTop: "12px" }}>
              {loading ? "Creating Account..." : "Join Now"}
            </button>
          </form>

          <div style={{ marginTop: "32px", textAlign: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "24px" }}>
            <p style={{ fontSize: "14px", color: "var(--text-dim)" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--cyan)", fontWeight: "700", textDecoration: "none" }}>
                Sign In →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
