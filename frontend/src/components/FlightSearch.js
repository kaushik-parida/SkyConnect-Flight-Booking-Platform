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

const AutocompleteInput = ({ label, name, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = AIRPORTS.filter(a => 
    a.city.toLowerCase().includes(search.toLowerCase()) || 
    a.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="input-group" style={{ marginBottom: 0, position: "relative" }}>
      <label className="input-label">{label}</label>
      <input 
        type="text" 
        className="input-field" 
        placeholder="Select City"
        value={isOpen ? search : (value ? `${value} (${AIRPORTS.find(a=>a.city===value)?.code || ''})` : "")}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => { setIsOpen(true); setSearch(""); }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && (
        <div style={{ 
          position: "absolute", top: "100%", left: 0, right: 0, 
          background: "#0f172a", border: "1px solid var(--glass-border)", 
          borderRadius: "12px", zIndex: 1000, marginTop: "8px", maxHeight: "180px", 
          overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", color: "#ffffff"
        }}>
          {filtered.length > 0 ? filtered.map(a => (
            <div 
              key={a.code} 
              style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", transition: "0.2s" }}
              onClick={() => {
                onChange({ target: { name, value: a.city } });
                setIsOpen(false);
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(61,90,254,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontWeight: 600 }}>{a.city}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 700 }}>{a.code}</span>
            </div>
          )) : <div style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "14px" }}>No cities found</div>}
        </div>
      )}
    </div>
  );
};

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
        <AutocompleteInput label="Leaving From" name="fromPlace" value={form.fromPlace} onChange={handleChange} />
        <AutocompleteInput label="Going To" name="toPlace" value={form.toPlace} onChange={handleChange} />

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

      {/* Error Row */}
      {error && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ color: "var(--danger)", fontSize: "13px", fontWeight: "600" }}>⚠ {error}</span>
        </div>
      )}
    </div>
  );
}