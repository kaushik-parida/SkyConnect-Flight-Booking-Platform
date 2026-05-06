import React from "react";
import Navbar from "../../components/Navbar";
import FlightSearch from "../../components/FlightSearch";

export default function UserPage() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="scroll-area" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <section style={{ 
          minHeight: "calc(100vh - 120px)", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          padding: "0 20px"
        }}>
          <div className="container animate-slide-up" style={{ maxWidth: "1000px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div className="badge badge-success" style={{ marginBottom: "20px", background: "rgba(0, 229, 255, 0.1)", color: "var(--cyan)", borderColor: "rgba(0, 229, 255, 0.2)" }}>
                ✦ PREMIER FLIGHT BOOKING EXPERIENCE
              </div>
              <h1 className="hero-title">
                Explore the Skies<br />
                With <span style={{ color: "var(--accent)" }}>SkyConnect</span>
              </h1>
              <p className="hero-subtitle" style={{ margin: "0 auto 32px" }}>
                Experience the ultimate in travel convenience. Seamless search, instant bookings, 
                and premium service—all in one place.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "32px", width: "100%" }}>
              <FlightSearch />
            </div>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: "60px" }}>
          <div className="grid grid-cols-4">
            {[
              { icon: "⚡", title: "Instant Booking", desc: "Book your flight in seconds with our streamlined checkout." },
              { icon: "💎", title: "Premium Care", desc: "Experience luxury travel with our curated selection of airlines." },
              { icon: "🛡️", title: "Safe & Secure", desc: "Your data and payments are protected by military-grade encryption." },
              { icon: "🌍", title: "Global Reach", desc: "Connect to hundreds of destinations across the country and beyond." },
            ].map((f, i) => (
              <div key={i} className="glass-card glass-card-hover" style={{ padding: "24px" }}>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "var(--white)" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: "1.5" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
