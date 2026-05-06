import React from "react";
import Navbar from "../../components/Navbar";
import FlightSearch from "../../components/FlightSearch";

export default function UserPage() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="scroll-area" style={{ padding: 0, display: "flex", flexDirection: "column", height: "calc(100vh - 72px)", overflow: "hidden" }}>
        <section style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px" }}>
          <div className="container" style={{ maxWidth: "1200px" }}>
            <div className="animate-slide-up" style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
                <span className="badge badge-accent" style={{ padding: "8px 20px", fontSize: "12px", letterSpacing: "0.05em" }}>
                  ✦ India's Premier Flight Booking Experience
                </span>
              </div>

              <h1 className="hero-title" style={{ fontSize: "clamp(42px, 5vw, 68px)", maxWidth: "860px", margin: "0 auto 24px" }}>
                Explore the Skies<br />with Confidence
              </h1>
              <p className="hero-subtitle" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto 32px", color: "var(--text-main)" }}>
                Search, compare, and book flights across India with real-time seat availability, smart pricing, and zero hidden fees.
              </p>
            </div>

            <div className="glass-card animate-scale-in" style={{
              padding: "40px 48px",
              animationDelay: "100ms",
              boxShadow: "var(--shadow-xl), 0 0 0 1px rgba(61,90,254,0.08)",
            }}>
              <FlightSearch />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
