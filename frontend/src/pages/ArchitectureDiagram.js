import React, { useState } from "react";

const COLORS = {
    frontend: "#38bdf8",
    edge: "#a78bfa",
    core: "#fbbf24",
    data: "#10b981",
    infra: "#94a3b8",
};

const SERVICES = {
    client: { id: "client", label: "Web Client", type: "frontend", desc: "React 18 SPA", x: 40, y: 240 },
    gateway: { id: "gateway", label: "API Gateway", type: "edge", desc: "Spring Cloud Gateway", x: 280, y: 240 },

    auth: { id: "auth", label: "Auth Service", type: "core", desc: "Spring Security / JWT", x: 560, y: 80 },
    flight: { id: "flight", label: "Flight Service", type: "core", desc: "Inventory & Search", x: 560, y: 240 },
    booking: { id: "booking", label: "Booking Service", type: "core", desc: "Saga Orchestration", x: 560, y: 400 },

    authdb: { id: "authdb", label: "Auth DB", type: "data", desc: "MySQL 8.0", x: 840, y: 80 },
    flightdb: { id: "flightdb", label: "Flight DB", type: "data", desc: "MySQL 8.0", x: 840, y: 240 },
    bookingdb: { id: "bookingdb", label: "Booking DB", type: "data", desc: "MySQL 8.0", x: 840, y: 400 },

    eureka: { id: "eureka", label: "Service Registry", type: "infra", desc: "Netflix Eureka", x: 280, y: 560 },
    config: { id: "config", label: "Config Server", type: "infra", desc: "Spring Cloud Config", x: 560, y: 560 },
    sonar: { id: "sonar", label: "SonarQube", type: "infra", desc: "Code Quality", x: 840, y: 560 },
};

const CONNECTIONS = [
    { from: "client", to: "gateway", label: "HTTPS / REST" },
    { from: "gateway", to: "auth", label: "/api/auth/**" },
    { from: "gateway", to: "flight", label: "/api/v1.0/flight/**" },
    { from: "gateway", to: "booking", label: "/api/v1.0/booking/**" },

    { from: "auth", to: "authdb", label: "TCP 3306" },
    { from: "flight", to: "flightdb", label: "TCP 3306" },
    { from: "booking", to: "bookingdb", label: "TCP 3306" },

    { from: "booking", to: "flight", label: "WebClient (Sync)", dashed: true },

    { from: "gateway", to: "eureka", label: "", dashed: true, infra: true },
    { from: "auth", to: "eureka", label: "", dashed: true, infra: true },
    { from: "flight", to: "eureka", label: "", dashed: true, infra: true },
    { from: "booking", to: "eureka", label: "", dashed: true, infra: true },

    { from: "auth", to: "config", label: "", dashed: true, infra: true },
    { from: "flight", to: "config", label: "", dashed: true, infra: true },
    { from: "booking", to: "config", label: "", dashed: true, infra: true },
];

const W = 160, H = 72;

export default function ArchitectureDiagram() {
    const [activeNode, setActiveNode] = useState(null);

    const getCenter = (svc) => ({ cx: svc.x + W / 2, cy: svc.y + H / 2 });

    const drawPath = (from, to) => {
        const fc = getCenter(from);
        const tc = getCenter(to);

        let x1 = fc.cx, y1 = fc.cy, x2 = tc.cx, y2 = tc.cy;

        if (Math.abs(tc.cx - fc.cx) > Math.abs(tc.cy - fc.cy)) {
            x1 = tc.cx > fc.cx ? from.x + W : from.x;
            x2 = tc.cx > fc.cx ? to.x : to.x + W;
            return `M ${x1} ${y1} C ${x1 + (x2 - x1) * 0.5} ${y1}, ${x1 + (x2 - x1) * 0.5} ${y2}, ${x2} ${y2}`;
        } else {
            y1 = tc.cy > fc.cy ? from.y + H : from.y;
            y2 = tc.cy > fc.cy ? to.y : to.y + H;
            return `M ${x1} ${y1} C ${x1} ${y1 + (y2 - y1) * 0.5}, ${x2} ${y1 + (y2 - y1) * 0.5}, ${x2} ${y2}`;
        }
    };

    const getLabelPos = (from, to) => {
        const fc = getCenter(from);
        const tc = getCenter(to);
        return { x: (fc.cx + tc.cx) / 2, y: (fc.cy + tc.cy) / 2 - 8 };
    };

    return (
        <div style={{ width: "100%", height: "100vh", background: "#F8FAFC", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", color: "#0F172A" }}>
            <div style={{ padding: "24px 40px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600", letterSpacing: "-0.5px", color: "#0F172A" }}>
                        System Architecture
                    </h1>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>High-level topology & network flow</p>
                </div>
                <div style={{ display: "flex", gap: "24px", fontSize: "12px", color: "#64748B" }}>
                    {Object.entries(COLORS).map(([type, color]) => (
                        <div key={type} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: color }} />
                            <span style={{ textTransform: "capitalize" }}>{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
                <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 1040 700" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <marker id="arrow-default" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#CBD5E1" />
                        </marker>
                        <marker id="arrow-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#0F172A" />
                        </marker>
                        <marker id="arrow-infra" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#E2E8F0" />
                        </marker>
                    </defs>

                    <rect x="520" y="40" width="460" height="470" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" pointerEvents="none" />
                    <text x="540" y="65" fill="#475569" fontSize="11" fontWeight="600" letterSpacing="1px" pointerEvents="none">VPC: PRIVATE SUBNET</text>

                    <rect x="240" y="40" width="240" height="470" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" pointerEvents="none" />
                    <text x="260" y="65" fill="#475569" fontSize="11" fontWeight="600" letterSpacing="1px" pointerEvents="none">VPC: PUBLIC SUBNET</text>

                    {CONNECTIONS.map((c, i) => {
                        const from = SERVICES[c.from], to = SERVICES[c.to];
                        const isActive = activeNode === c.from || activeNode === c.to;
                        const isFaded = activeNode && !isActive;

                        let strokeColor = c.infra ? "#E2E8F0" : "#CBD5E1";
                        let marker = c.infra ? "url(#arrow-infra)" : "url(#arrow-default)";

                        if (isActive) {
                            strokeColor = COLORS[SERVICES[activeNode].type] || "#0F172A";
                            marker = "url(#arrow-active)";
                        }

                        return (
                            <g key={i} style={{ transition: "opacity 0.3s", opacity: isFaded ? 0.1 : 1, pointerEvents: "none" }}>
                                <path
                                    d={drawPath(from, to)}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    strokeDasharray={c.dashed ? "6,4" : "none"}
                                    markerEnd={marker}
                                    style={{ transition: "all 0.3s" }}
                                />
                                {c.label && (isActive || !c.infra) && (
                                    <text
                                        {...getLabelPos(from, to)}
                                        textAnchor="middle" fill={isActive ? "#0F172A" : "#64748B"}
                                        fontSize="10" fontWeight={isActive ? "600" : "500"}
                                    >
                                        {c.label}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {Object.values(SERVICES).map(svc => {
                        const isHovered = activeNode === svc.id;
                        const isFaded = activeNode && activeNode !== svc.id && !CONNECTIONS.some(c => (c.from === activeNode && c.to === svc.id) || (c.to === activeNode && c.from === svc.id));
                        const color = COLORS[svc.type];

                        return (
                            <g
                                key={svc.id}
                                transform={`translate(${svc.x},${svc.y})`}
                                onMouseEnter={() => setActiveNode(svc.id)}
                                onMouseLeave={() => setActiveNode(null)}
                                style={{ opacity: isFaded ? 0.2 : 1, transition: "all 0.3s", cursor: "pointer" }}
                            >
                                <rect
                                    width={W} height={H} rx="8"
                                    fill="#FFFFFF"
                                    stroke={isHovered ? color : "#E2E8F0"}
                                    strokeWidth={isHovered ? 2 : 1}
                                    style={{ transition: "all 0.3s" }}
                                />

                                <path d={`M 0 8 Q 0 0 8 0 L ${W - 8} 0 Q ${W} 0 ${W} 8 L ${W} 4 L 0 4 Z`} fill={color} opacity={isHovered ? 1 : 0.6} />

                                <text x="16" y="32" fill="#0F172A" fontSize="13" fontWeight="600" pointerEvents="none">{svc.label}</text>
                                <text x="16" y="52" fill="#64748B" fontSize="11" pointerEvents="none">{svc.desc}</text>

                                <rect width={W} height={H} rx="8" fill="transparent" />
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
