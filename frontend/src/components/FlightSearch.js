import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights } from "../services/api";
import { AIRPORTS } from "../constants/airports";

const TRIP_TYPES = ["ONE_WAY", "ROUND_TRIP"];
const SORT_OPTIONS = [
  { label: "Price Low-High", value: "PRICE", dir: false },
  { label: "Price High-Low", value: "PRICE", dir: true },
  { label: "Earliest", value: "TIME", dir: false },
  { label: "Latest", value: "TIME", dir: true },
];

export default function FlightSearch() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [tripType, setTripType] = useState("ONE_WAY");
  const [form, setForm] = useState({ fromPlace: "", toPlace: "", departureDate: "", returnDate: "" });
  const [sortOption, setSortOption] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = async () => {
    if (!form.fromPlace || !form.toPlace || !form.departureDate) { setError("Required fields missing"); return; }
    if (form.fromPlace === form.toPlace) { setError("Source & destination same"); return; }
    if (tripType === "ROUND_TRIP" && !form.returnDate) { setError("Return date missing"); return; }

    setError("");
    setLoading(true);
    try {
      const sort = SORT_OPTIONS[sortOption];
      const payload = {
        fromPlace: form.fromPlace,
        toPlace: form.toPlace,
        departureDate: form.departureDate,
        returnDate: tripType === "ROUND_TRIP" ? form.returnDate : null,
        tripType,
        sortBy: sort.value,
        sortDirection: sort.dir,
      };
      const data = await searchFlights(payload);
      navigate("/results", {
        state: {
          results: data,
          searchParams: { ...form, tripType }
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Trip Type Toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {TRIP_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTripType(t)}
            className={`btn ${tripType === t ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: "8px 24px", fontSize: "13px", borderRadius: "30px" }}
          >
            {t === "ONE_WAY" ? "✈ One Way" : "⇄ Round Trip"}
          </button>
        ))}
      </div>

      {/* Main Search Bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `1fr 1fr 1fr ${tripType === "ROUND_TRIP" ? "1fr" : ""} auto`,
        gap: "12px",
        alignItems: "end"
      }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Leaving From</label>
          <select name="fromPlace" className="input-field" value={form.fromPlace} onChange={handleChange}>
            <option value="">Select City</option>
            {AIRPORTS.map((p) => <option key={p.code} value={p.city}>{p.city} ({p.code})</option>)}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Going To</label>
          <select name="toPlace" className="input-field" value={form.toPlace} onChange={handleChange}>
            <option value="">Select City</option>
            {AIRPORTS.map((p) => <option key={p.code} value={p.city}>{p.city} ({p.code})</option>)}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Departure</label>
          <input name="departureDate" type="date" className="input-field" min={today} value={form.departureDate} onChange={handleChange} style={{ colorScheme: "dark" }} />
        </div>

        {tripType === "ROUND_TRIP" && (
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Return</label>
            <input name="returnDate" type="date" className="input-field" min={form.departureDate || today} value={form.returnDate} onChange={handleChange} style={{ colorScheme: "dark" }} />
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ height: "50px", minWidth: "140px" }}>
          {loading ? "Searching..." : "Find Flights"}
        </button>
      </div>

      {/* Sort & Error Row */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Sort Options:</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {SORT_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSortOption(i)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "1px solid",
                  transition: "var(--transition)",
                  borderColor: sortOption === i ? "var(--accent)" : "var(--glass-border)",
                  background: sortOption === i ? "rgba(61, 90, 254, 0.1)" : "transparent",
                  color: sortOption === i ? "var(--white)" : "var(--text-dim)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && <span style={{ color: "var(--danger)", fontSize: "13px", fontWeight: "600" }}>⚠ {error}</span>}
      </div>
    </div>
  );
}