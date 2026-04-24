import { useState } from "react";

const colors = {
  gateway: "#0EA5E9",
  auth: "#8B5CF6",
  flight: "#10B981",
  airline: "#F59E0B",
  booking: "#EF4444",
  user: "#06B6D4",
  db: "#64748B",
  frontend: "#6366F1",
  kafka: "#F97316",
  bg: "#0B1120",
  card: "#111827",
  border: "#1E293B",
  text: "#F1F5F9",
  subtext: "#94A3B8",
  line: "#334155",
};

const services = [
  { id: "auth", label: "Auth Service", sub: "Spring Boot", color: colors.auth, icon: "🔐", port: ":8081", db: "auth_db" },
  { id: "flight", label: "Flight Service", sub: "Spring Boot", color: colors.flight, icon: "✈️", port: ":8082", db: "flight_db" },
  { id: "airline", label: "Airline Service", sub: "Node.js + Express", color: colors.airline, icon: "🏢", port: ":8083", db: "airline_db" },
  { id: "booking", label: "Booking Service", sub: "Spring Boot", color: colors.booking, icon: "📋", port: ":8084", db: "booking_db" },
  { id: "user", label: "User Service", sub: "Spring Boot", color: colors.user, icon: "👤", port: ":8085", db: "user_db" },
];

const endpoints = {
  auth: ["POST /auth/register", "POST /auth/login", "GET /auth/oauth/callback"],
  flight: ["GET /flights/search", "GET /flights/{id}", "POST /flights", "PUT /flights/{id}/seats"],
  airline: ["GET /airlines", "POST /airlines", "GET /airlines/{id}"],
  booking: ["POST /bookings", "GET /bookings/{id}", "GET /bookings/user/{userId}"],
  user: ["GET /users/{id}", "PUT /users/{id}", "GET /users/profile"],
};

const layers = [
  { label: "CLIENT LAYER", color: colors.frontend },
  { label: "GATEWAY LAYER", color: colors.gateway },
  { label: "SERVICE LAYER", color: colors.flight },
  { label: "DATA LAYER", color: colors.db },
];

export default function ArchitectureDiagram() {
  const [active, setActive] = useState(null);
  const [hoveredLayer, setHoveredLayer] = useState(null);

  return (
    <div style={{
      background: colors.bg,
      minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: colors.text,
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ fontSize: "28px" }}>✈️</span>
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
            FlightBook — System Architecture
          </h1>
        </div>
        <p style={{ color: colors.subtext, margin: 0, fontSize: "14px" }}>
          Microservices · Java Spring Boot · Node.js · React · MySQL · Docker
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Layer Labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0px", minWidth: "120px" }}>
          {layers.map((l, i) => (
            <div key={i} style={{
              flex: i === 2 ? 3 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "14px",
              borderRight: `2px solid ${l.color}33`,
            }}>
              <span style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: l.color,
                textAlign: "right",
                lineHeight: 1.4,
              }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Main Diagram */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Frontend */}
          <div style={{
            background: `${colors.frontend}15`,
            border: `1.5px solid ${colors.frontend}40`,
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}>
            <div style={{ fontSize: "20px" }}>🖥️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "15px", color: colors.frontend }}>React Frontend</div>
              <div style={{ fontSize: "12px", color: colors.subtext, marginTop: "2px" }}>
                Home · Search Results · Booking · My Bookings · Login/Register
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Tailwind CSS", "React Router", "Axios", "JWT Storage"].map(t => (
                <span key={t} style={{
                  background: `${colors.frontend}20`,
                  border: `1px solid ${colors.frontend}40`,
                  borderRadius: "20px",
                  padding: "3px 10px",
                  fontSize: "11px",
                  color: colors.frontend,
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: colors.subtext, fontSize: "12px", gap: "6px" }}>
            <div style={{ flex: 1, height: "1px", background: colors.line }} />
            <span>HTTPS · JWT Bearer Token</span>
            <div style={{ flex: 1, height: "1px", background: colors.line }} />
          </div>

          {/* API Gateway */}
          <div style={{
            background: `${colors.gateway}15`,
            border: `1.5px solid ${colors.gateway}50`,
            borderRadius: "12px",
            padding: "16px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div style={{ fontSize: "20px" }}>🔀</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: colors.gateway }}>API Gateway</div>
                <div style={{ fontSize: "11px", color: colors.subtext }}>Spring Cloud Gateway · :8080</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["JWT Validation", "Rate Limiting", "Load Balancing", "Route Config", "CORS Handling", "Request Logging"].map(f => (
                <span key={f} style={{
                  background: `${colors.gateway}15`,
                  border: `1px solid ${colors.gateway}30`,
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  color: colors.gateway,
                }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: colors.subtext, fontSize: "12px", gap: "6px" }}>
            <div style={{ flex: 1, height: "1px", background: colors.line }} />
            <span>Internal REST · Validated JWT</span>
            <div style={{ flex: 1, height: "1px", background: colors.line }} />
          </div>

          {/* Services */}
          <div style={{ display: "flex", gap: "12px" }}>
            {services.map(svc => (
              <div
                key={svc.id}
                onClick={() => setActive(active === svc.id ? null : svc.id)}
                style={{
                  flex: 1,
                  background: active === svc.id ? `${svc.color}20` : `${svc.color}0D`,
                  border: `1.5px solid ${active === svc.id ? svc.color : svc.color + "40"}`,
                  borderRadius: "12px",
                  padding: "14px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  transform: active === svc.id ? "translateY(-3px)" : "none",
                }}
              >
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{svc.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: svc.color, marginBottom: "2px" }}>{svc.label}</div>
                <div style={{ fontSize: "10px", color: colors.subtext, marginBottom: "6px" }}>{svc.sub}</div>
                <div style={{
                  background: `${svc.color}20`,
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontSize: "10px",
                  color: svc.color,
                  display: "inline-block",
                  marginBottom: "8px",
                }}>{svc.port}</div>

                {/* Endpoints */}
                {active === svc.id && (
                  <div style={{ marginTop: "8px", borderTop: `1px solid ${svc.color}30`, paddingTop: "8px" }}>
                    {endpoints[svc.id].map(ep => (
                      <div key={ep} style={{
                        fontSize: "10px",
                        color: colors.subtext,
                        padding: "2px 0",
                        fontFamily: "monospace",
                      }}>{ep}</div>
                    ))}
                  </div>
                )}

                {/* Layers inside service */}
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "8px" }}>
                  {["Controller", "Service", "Repository"].map((l, i) => (
                    <div key={l} style={{
                      background: `${svc.color}${15 + i * 8}`,
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "10px",
                      color: svc.color,
                      opacity: 0.9,
                    }}>{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Service Communication */}
          <div style={{
            background: `${colors.booking}0D`,
            border: `1px dashed ${colors.booking}40`,
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "11px",
            color: colors.subtext,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{ color: colors.booking, fontWeight: 600 }}>⟳ Service-to-Service</span>
            <span>Booking Service → Flight Service (validate + reduce seats via REST)</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <span style={{ background: `${colors.kafka}20`, border: `1px solid ${colors.kafka}40`, borderRadius: "4px", padding: "2px 8px", color: colors.kafka }}>
                🟠 Kafka-Ready (async future)
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: colors.subtext, fontSize: "12px", gap: "6px" }}>
            <div style={{ flex: 1, height: "1px", background: colors.line }} />
            <span>JPA / JDBC · Database-per-Service</span>
            <div style={{ flex: 1, height: "1px", background: colors.line }} />
          </div>

          {/* Databases */}
          <div style={{ display: "flex", gap: "12px" }}>
            {services.map(svc => (
              <div key={svc.id} style={{
                flex: 1,
                background: `${colors.db}15`,
                border: `1px solid ${colors.db}40`,
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>🗄️</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: colors.subtext, fontFamily: "monospace" }}>{svc.db}</div>
                <div style={{ fontSize: "10px", color: colors.db, marginTop: "2px" }}>MySQL 8</div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Panel */}
        <div style={{ minWidth: "200px", display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Legend */}
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "10px",
            padding: "14px",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: colors.subtext, marginBottom: "10px" }}>LEGEND</div>
            {services.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: "11px", color: colors.subtext }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "10px",
            padding: "14px",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: colors.subtext, marginBottom: "10px" }}>TECH STACK</div>
            {[
              { label: "Spring Boot", val: "3.x", color: colors.flight },
              { label: "Node.js", val: "20 LTS", color: colors.airline },
              { label: "React", val: "18", color: colors.frontend },
              { label: "MySQL", val: "8.0", color: colors.db },
              { label: "Docker", val: "Compose", color: colors.gateway },
              { label: "OAuth2", val: "JWT", color: colors.auth },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <span style={{ fontSize: "11px", color: colors.subtext }}>{t.label}</span>
                <span style={{ fontSize: "10px", background: `${t.color}20`, color: t.color, padding: "1px 7px", borderRadius: "10px" }}>{t.val}</span>
              </div>
            ))}
          </div>

          {/* Design Patterns */}
          <div style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "10px",
            padding: "14px",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: colors.subtext, marginBottom: "10px" }}>PATTERNS</div>
            {[
              "Database-per-Service",
              "DTO Pattern",
              "Repository Pattern",
              "API Gateway",
              "JWT Stateless Auth",
              "Global Exception Handler",
              "Clean Layered Arch",
            ].map(p => (
              <div key={p} style={{
                fontSize: "10px",
                color: colors.subtext,
                padding: "3px 0",
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{ color: colors.flight }}>✓</span> {p}
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{
            background: `${colors.gateway}10`,
            border: `1px solid ${colors.gateway}30`,
            borderRadius: "10px",
            padding: "12px",
            fontSize: "11px",
            color: colors.subtext,
          }}>
            <span style={{ color: colors.gateway }}>💡 Click</span> any service card to expand its API endpoints
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "32px", color: colors.subtext, fontSize: "11px" }}>
        Capstone Project · FlightBook Microservices Platform · All services containerized via Docker Compose
      </div>
    </div>
  );
}
