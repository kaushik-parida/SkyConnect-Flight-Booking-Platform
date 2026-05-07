import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SLIDES = [
    {
        id: "intro",
        badge: "01 — Introduction",
        title: "SkyConnect",
        subtitle: "Production-Grade Flight Booking Platform",
        bullets: [
            " Full microservices architecture — 6 independently deployable Spring Boot services",
            " API Gateway with JWT authentication as the single entry point",
            " End-to-end booking lifecycle — search → book → pay → board → cancel",
            " Multi-passenger support with individual boarding passes & QR codes",
            " Role-based access — User flows vs Admin Command Center",
        ],
        accent: "#6366F1",
        demo: null,
    },
    {
        id: "architecture",
        badge: "02 — Architecture",
        title: "Microservices Architecture",
        subtitle: "Eureka Discovery · API Gateway · Config Server",
        bullets: [
            " Eureka Server — all services register themselves; dynamic hostname resolution, no hardcoded URLs",
            " API Gateway — single port 3000; JWT validation happens once at the edge, not in every service",
            " Config Server — one Git-backed config store; environment-specific profiles (dev/prod) without redeployment",
            " Auth Service — issues JWT; BCrypt 10-round hashing; role embedded in token payload",
            " Flight Service — owns seat inventory; WebClient called by Booking Service for real-time data",
            " Booking Service — full saga: PENDING → CONFIRMED → CANCELLED; compensating seat restoration",
        ],
        accent: "#3B82F6",
        demo: "/admin",
    },
    {
        id: "booking",
        badge: "03 — Booking Service",
        title: "Booking Service Core",
        subtitle: "Saga orchestration · Dynamic pricing · ACID compliance",
        bullets: [
            {
                text: " JPA Entity Graph: @OneToMany(orphanRemoval = true) for Booking ↔ Passenger lifecycle management",
                code: `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)\n@JoinColumn(name = "booking_id")\nprivate List<BookingPassenger> passengers = new ArrayList<>();`,
                language: "java",
                title: "Booking.java"
            },
            {
                text: " Dynamic Price Engine: Fare calculation applies a 1.5x multiplier for BUSINESS class pax (passengers)",
                code: `private BigDecimal calculateTotalPrice(FlightResponse flight, SeatClass selectedClass, int numberOfSeats) {\n BigDecimal unitPrice = flight.getTicketCost();\n if (selectedClass == SeatClass.BUSINESS) {\n unitPrice = unitPrice.multiply(BigDecimal.valueOf(1.5));\n }\n return unitPrice.multiply(BigDecimal.valueOf(numberOfSeats));\n}`,
                language: "java",
                title: "BookingServiceImplementation.java"
            },
            " Defensive Programming: O(N^2) passenger duplication cross-check before persisting booking",
            {
                text: " Distributed Transaction Fallback: Synchronous WebClient call to FlightService to rollback/restore seats atomically",
                code: `public void restoreSeats(Long flightId, Integer seatsToRestore, SeatClass seatClass) {\n Map<String, Object> body = new HashMap<>();\n body.put("economySeats", updatedEconomySeats);\n body.put("businessSeats", updatedBusinessSeats);\n webClient.patch().uri("api/v1.0/flights/{id}", flightId)\n .bodyValue(body).retrieve().bodyToMono(Void.class).block();\n}`,
                language: "java",
                title: "FlightServiceClient.java"
            },
        ],
        accent: "#8B5CF6",
        demo: "/booking",
    },
    {
        id: "gateway",
        badge: "04 — API Gateway",
        title: "Edge & Authentication",
        subtitle: "JWT filter chain · Global CORS · Route definitions",
        bullets: [
            {
                text: " Stateless JWT Filter: Reactive OncePerRequestFilter validates RS256 signatures before routing",
                code: `public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {\n String token = extractToken(exchange.getRequest());\n if (jwtUtil.validateToken(token)) {\n ServerHttpRequest request = exchange.getRequest().mutate()\n .header("X-User-Id", jwtUtil.extractUserId(token)).build();\n return chain.filter(exchange.mutate().request(request).build());\n }\n return onError(exchange, "Unauthorized", HttpStatus.UNAUTHORIZED);\n}`,
                language: "java",
                title: "JwtAuthenticationFilter.java"
            },
            " Centralized CORS configuration: Whitelists specific origins (e.g. localhost:3001) preventing cross-origin attacks",
            " Dynamic Route Definitions: Predicate-based routing strictly partitions /api/auth/** and /api/v1.0/flight/**",
        ],
        accent: "#F59E0B",
        demo: null,
    },
    {
        id: "quality",
        badge: "05 — Code Quality",
        title: "Engineering Discipline",
        subtitle: "Static analysis · Code smells · Coverage",
        bullets: [
            " SonarQube CI integration: Zero critical vulnerabilities; cognitive complexity refactored to < 15",
            {
                text: " Mockito Lenient Stubs: Resolved UnnecessaryStubbingException in duplicate detection logic tests",
                code: `@Test\n@DisplayName("cancelBookingById: should still cancel when restoreSeats fails")\nvoid test_cancelBookingById_restoreSeatsFailure_stillCancels() {\n when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));\n doThrow(new RuntimeException("Service Down")).when(flightServiceClient).restoreSeats(anyLong(), anyInt(), any());\n // Proceed to assert partial success\n}`,
                language: "java",
                title: "BookingServiceImplementationTest.java"
            },
            " Strictly Typed Exceptions: Custom exception hierarchy (e.g. FlightNotActiveException) eliminates generic RuntimeExceptions",
            " Spring Dependency Management: Unified Maven BOM guarantees binary compatibility across all microservices",
        ],
        accent: "#10B981",
        demo: null,
    },
    {
        id: "features",
        badge: "06 — Beyond CRUD",
        title: "Advanced Features",
        subtitle: "What makes this production-ready",
        bullets: [
            {
                text: " Paginated APIs everywhere — Page<T> with Pageable; no full-table loads",
                code: `@GetMapping("/history/{userId}")\npublic ResponseEntity<PagedResponse<BookingResponse>> getBookingByUserId(\n @PathVariable String userId,\n @RequestParam(defaultValue = "0") int page,\n @RequestParam(defaultValue = "10") int size) {\n\n Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "bookingTime"));\n Page<BookingResponse> result = bookingService.getBookingsByUserId(userId, pageable);\n return ResponseEntity.ok(...);\n}`,
                language: "java",
                title: "BookingController.java"
            },
            " Custom JPQL query: findByIdWithPassengers — LEFT JOIN FETCH avoids N+1 lazy load problem",
            {
                text: " DB Indexes on Booking: idx_booking_reference, idx_user_id, idx_flight_id — without indexes, getBookingHistory scans every row; with B-tree index it jumps straight to the matching userId in O(log n)",
                code: `@Entity\n@Table(name = "bookings", indexes = {\n @Index(name = "idx_user_id", columnList = "user_id"),\n @Index(name = "idx_flight_id", columnList = "flight_id"),\n @Index(name = "idx_status", columnList = "status"),\n @Index(name = "idx_booking_reference", columnList = "booking_reference")\n})\npublic class Booking {\n @Id\n @GeneratedValue(strategy = GenerationType.IDENTITY)\n private Long bookingId;\n // ...\n}`,
                language: "java",
                title: "Booking.java"
            },
            {
                text: " @CreationTimestamp / @UpdateTimestamp — automatic audit fields, no manual LocalDateTime.now()",
                code: `@CreationTimestamp\n@Column(name = "booking_time", nullable = false, updatable = false)\nprivate LocalDateTime bookingTime;\n\n@UpdateTimestamp\n@Column(name = "updated_at")\nprivate LocalDateTime updatedAt;`,
                language: "java",
                title: "Booking.java"
            },
            " Builder pattern via Lombok @Builder — immutable object construction, readable and testable",
            " FetchType.LAZY everywhere — passengers only loaded when explicitly needed, not on every query",
        ],
        accent: "#EC4899",
        demo: "/booking/history",
    },
    {
        id: "frontend",
        badge: "07 — Frontend",
        title: "React Frontend Architecture",
        subtitle: "Design system · Context API · Axios interceptors",
        bullets: [
            " CSS Variables Architecture: Pure CSS custom properties for O(1) theme switching without pre-processors",
            " React Context API: Centralized token lifecycle management and automatic header injection",
            {
                text: " Axios Interceptors: Global HTTP middleware auto-attaches JWTs to prevent unauthenticated drops",
                code: `api.interceptors.request.use((config) => {\n const token = localStorage.getItem("token");\n if (token) config.headers.Authorization = \`Bearer \${token}\`;\n return config;\n});`,
                language: "javascript",
                title: "api.js"
            },
            {
                text: " Deterministic Seat Engine: Non-colliding seating offsets calculated strictly from PNR seeds",
                code: `const deriveSeat = (bookingId, passengerIndex, seatClass) => {\n const seed = [...String(bookingId)].reduce((acc, c) => acc + c.charCodeAt(0), 0);\n const r = seededRandom(seed);\n // Computes base coordinates and adds strictly deterministic passenger offset\n};`,
                language: "javascript",
                title: "BoardingPassPage.js"
            },
            " Z-Index Stacking Contexts: Isolated portal modals ensuring absolute visibility of error boundaries",
        ],
        accent: "#06B6D4",
        demo: "/",
    },
    {
        id: "bugs",
        badge: "08 — Bug Report",
        title: "Bugs Fixed in This Sprint",
        subtitle: "Root cause → fix",
        bullets: [
            " Bug 1: Cancellation error hidden — modal stayed open with error box inside (z-index resolved)",
            " Bug 2: Admin calendar allowed past dates — added min={nowMinLocal()} to all datetime-local inputs",
            " Bug 3: Edit Flight not saving — normalizeDateTime() was double-appending :00 seconds",
            " Bug 4: Multi-passenger → 1 boarding pass — BoardingPassPage now maps over passengers array",
            " Bug 5: Meal options showed raw enum — now displays Vegetarian / Non-Veg / No Meal",
            " Bug 6: Payment method hardcoded — now a selectable card UI (Card / UPI / Net Banking)",
            " Bug 7: Partial Cancellation — Users can now cancel specific passengers rather than the entire booking",
            " Bug 8: Seat Collision — BoardingPass deterministic LCG hash rewritten to mathematically guarantee collision-free seating",
        ],
        accent: "#22C55E",
        demo: null,
    },
    {
        id: "pending",
        badge: "09 — Roadmap",
        title: "Pending & Future Enhancements",
        subtitle: "Honest engineering backlog",
        bullets: [
            " P1: Real payment gateway — Razorpay/Stripe integration (currently simulated)",
            " P2: Seat overbooking race condition — needs SELECT FOR UPDATE / optimistic locking @Version",
            " P3: Email notifications — Spring Mail + SendGrid on booking/cancellation events",
            " P4: Config Server HA — single point of failure; needs replica or Vault fallback",
            " Sprint 4: Email OTP login — SendGrid + Redis TTL for OTP storage",
            " Sprint 5: Google SSO — Spring Security OAuth2 Client (requires HTTPS + GCP OAuth credentials)",
        ],
        accent: "#F97316",
        demo: null,
    },
];

export default function PresentationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(0);
    const [activeCode, setActiveCode] = useState(null);
    const [showBackBtn, setShowBackBtn] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("presentationSlide")) {
            setCurrent(parseInt(sessionStorage.getItem("presentationSlide")));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("presentationSlide", current);
    }, [current]);

    useEffect(() => {
        setShowBackBtn(location.state?.fromPresentation === true);
    }, [location.state]);
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") setCurrent(c => Math.min(c + 1, SLIDES.length - 1));
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") setCurrent(c => Math.max(c - 1, 0));
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const slide = SLIDES[current];

    return (
        <div style={{
            width: "100vw", height: "100vh", overflow: "hidden",
            background: "#F8FAFC", fontFamily: "'Inter', sans-serif",
            display: "flex", color: "#1E293B", position: "relative"
        }}>
            <div style={{
                width: "280px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
                display: "flex", flexDirection: "column", padding: "32px 0", zIndex: 10,
                boxShadow: "2px 0 10px rgba(0,0,0,0.02)", flexShrink: 0
            }}>
                <div style={{ padding: "0 32px", marginBottom: "40px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
                        <span style={{ color: "#fff", fontSize: "20px" }}></span>
                    </div>
                    <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.5px" }}>SkyConnect Platform</h2>
                    <p style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginTop: "4px" }}>Engineering Review Deck</p>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", padding: "0 16px", overflowY: "auto" }}>
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => setCurrent(i)}
                            style={{
                                padding: "12px 16px", borderRadius: "8px", background: current === i ? `${s.accent}15` : "transparent",
                                border: "none", borderLeft: current === i ? `3px solid ${s.accent}` : "3px solid transparent",
                                color: current === i ? s.accent : "#475569",
                                fontSize: "12px", fontWeight: current === i ? "700" : "500",
                                cursor: "pointer", textAlign: "left", transition: "all 0.15s", fontFamily: "'Outfit',sans-serif",
                            }}
                        >
                            {s.badge}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "64px 80px", overflow: "hidden" }}>
                    <div style={{ marginBottom: "40px" }}>
                        <div style={{
                            display: "inline-block", padding: "4px 14px", borderRadius: "99px",
                            background: `${slide.accent}15`, border: `1px solid ${slide.accent}30`,
                            color: slide.accent, fontSize: "11px", fontWeight: "800",
                            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "20px",
                        }}>
                            {slide.badge}
                        </div>
                        <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#0F172A", lineHeight: 1.1, marginBottom: "12px", letterSpacing: "-1px" }}>
                            {slide.title}
                        </h1>
                        <p style={{ fontSize: "18px", color: "#64748B", fontWeight: "500" }}>{slide.subtitle}</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, overflowY: "auto", paddingRight: "16px", paddingBottom: "100px" }}>
                        {slide.bullets.map((b, i) => {
                            const isObj = typeof b !== 'string';
                            const text = isObj ? b.text : b;
                            const hasCode = isObj && b.code;

                            return (
                                <div
                                    key={i}
                                    onClick={() => hasCode && setActiveCode(b)}
                                    style={{
                                        display: "flex", alignItems: "flex-start", gap: "16px",
                                        padding: "18px 24px", borderRadius: "12px",
                                        background: "#FFFFFF", border: "1px solid #E2E8F0",
                                        cursor: hasCode ? "pointer" : "default",
                                        transition: "all 0.2s",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                                    }}
                                >
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: slide.accent, marginTop: "9px", flexShrink: 0 }} />
                                    <span style={{ fontSize: "16px", color: "#334155", lineHeight: 1.6, flex: 1, fontWeight: "500" }}>{text}</span>
                                    {hasCode && (
                                        <span style={{ fontSize: "12px", padding: "4px 10px", background: `${slide.accent}10`, borderRadius: "6px", color: slide.accent, fontWeight: "700", flexShrink: 0, marginTop: "2px" }}>
                                            &lt;/&gt; View Code
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        {slide.demo && (
                            <div style={{ marginTop: "16px", display: "flex", gap: "12px", flexShrink: 0 }}>
                                <button
                                    onClick={() => window.open(slide.demo, '_blank')}
                                    style={{
                                        padding: "12px 28px", borderRadius: "8px",
                                        background: slide.accent, color: "#fff",
                                        border: "none", fontSize: "14px", fontWeight: "700",
                                        cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                                        boxShadow: `0 4px 12px ${slide.accent}40`
                                    }}
                                >
                                    Live Demo — {slide.demo}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ height: "72px", borderTop: "1px solid #E2E8F0", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", position: "absolute", bottom: 0, width: "100%", zIndex: 20 }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{ background: "transparent", border: "none", color: "#64748B", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
                    >
                        ← Exit Presentation
                    </button>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "6px", marginRight: "24px" }}>
                            {SLIDES.map((_, i) => (
                                <div key={i} onClick={() => setCurrent(i)} style={{
                                    width: i === current ? "24px" : "8px", height: "8px", borderRadius: "99px",
                                    background: i === current ? slide.accent : "#E2E8F0",
                                    cursor: "pointer", transition: "all 0.2s",
                                }} />
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrent(c => Math.max(c - 1, 0))}
                            disabled={current === 0}
                            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: current === 0 ? "#CBD5E1" : "#475569", fontSize: "16px", cursor: current === 0 ? "default" : "pointer", transition: "all 0.2s" }}
                        >

                        </button>
                        <button
                            onClick={() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1))}
                            disabled={current === SLIDES.length - 1}
                            style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "none", background: current === SLIDES.length - 1 ? "#E2E8F0" : slide.accent, color: "#fff", fontSize: "16px", fontWeight: "700", cursor: current === SLIDES.length - 1 ? "default" : "pointer", transition: "all 0.2s" }}
                        >

                        </button>
                    </div>
                </div>
            </div>

            {activeCode && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
                }} onClick={() => setActiveCode(null)}>
                    <div style={{
                        background: "#FFFFFF", borderRadius: "12px", width: "800px", maxWidth: "90%",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden", border: "1px solid #E2E8F0"
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            background: "#F8FAFC", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F56" }}></div>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFBD2E" }}></div>
                                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27C93F" }}></div>
                                </div>
                                <span style={{ color: "#475569", fontSize: "13px", fontFamily: "monospace", marginLeft: "10px", fontWeight: "600" }}>{activeCode.title}</span>
                            </div>
                            <button onClick={() => setActiveCode(null)} style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}></button>
                        </div>
                        <div style={{ padding: "24px", overflowX: "auto", background: "#0F172A" }}>
                            <pre style={{ margin: 0, color: "#E2E8F0", fontFamily: "'Fira Code', 'Consolas', monospace", fontSize: "14px", lineHeight: 1.5 }}>
                                <code>{activeCode.code}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
 @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
 `}</style>
        </div>
    );
}
