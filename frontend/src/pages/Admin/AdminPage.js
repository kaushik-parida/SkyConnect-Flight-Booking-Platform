import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { getAirlines, addAirline, blockAirline, unblockAirline, addFlight, getAllBookings } from "../../services/api";

const TABS = ["Airlines", "Add Flight", "All Bookings"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Airlines");
  const [airlines, setAirlines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const [airlineForm, setAirlineForm] = useState({ name: "" });
  const [flightForm, setFlightForm] = useState({
    flightNumber: "", airlineId: "", fromPlace: "", toPlace: "",
    departureTime: "", arrivalTime: "", economySeats: "", businessSeats: "",
    ticketCost: "", mealType: "VEG",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAirlines = useCallback(async () => {
    setLoading(true);
    try { 
      const data = await getAirlines();
      setAirlines(data); 
    }
    catch { showToast("Failed to load airlines", "error"); }
    finally { setLoading(false); }
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data.content || []);
    }
    catch { showToast("Failed to load bookings", "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "Airlines") loadAirlines();
    if (activeTab === "All Bookings") loadBookings();
  }, [activeTab, loadAirlines, loadBookings]);

  const handleAddAirline = async (e) => {
    e.preventDefault();
    if (!airlineForm.name) { showToast("Airline name required", "error"); return; }
    try {
      await addAirline(airlineForm);
      setAirlineForm({ name: "" });
      showToast("Airline added successfully");
      loadAirlines();
    } catch (err) { showToast("Failed to add airline", "error"); }
  };

  const handleStatusChange = async () => {
    if (!confirmModal) return;
    try {
      if (confirmModal.action === "BLOCK") await blockAirline(confirmModal.airline.airlineId);
      else await unblockAirline(confirmModal.airline.airlineId);
      showToast(`Airline ${confirmModal.action.toLowerCase()}ed`);
      setConfirmModal(null);
      loadAirlines();
    } catch (err) { showToast("Action failed", "error"); }
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      await addFlight({
        ...flightForm,
        airlineId: Number(flightForm.airlineId),
        economySeats: Number(flightForm.economySeats),
        businessSeats: Number(flightForm.businessSeats),
        ticketCost: Number(flightForm.ticketCost),
        departureTime: flightForm.departureTime + ":00",
        arrivalTime: flightForm.arrivalTime + ":00",
      });
      setFlightForm({ flightNumber: "", airlineId: "", fromPlace: "", toPlace: "", departureTime: "", arrivalTime: "", economySeats: "", businessSeats: "", ticketCost: "", mealType: "VEG" });
      showToast("Flight added successfully!");
    } catch (err) { showToast("Failed to add flight", "error"); }
  };

  return (
    <div className="app-container">
      <Navbar />
      
      {toast && (
        <div className={`badge badge-${toast.type === 'error' ? 'danger' : 'success'}`} 
             style={{ position: "fixed", top: "100px", right: "40px", zIndex: 1000, padding: "12px 24px", boxShadow: "var(--shadow-lg)" }}>
          {toast.msg}
        </div>
      )}

      <main className="scroll-area">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "32px", color: "var(--white)", marginBottom: "4px" }}>Admin Command Center</h1>
            <p style={{ color: "var(--text-dim)" }}>Manage airline registry, flight schedules, and customer bookings.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
            {TABS.map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: "30px", padding: "10px 24px" }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="animate-slide-up">
            {activeTab === "Airlines" && (
              <div className="grid grid-cols-3" style={{ gridTemplateColumns: "350px 1fr" }}>
                <div className="glass-card" style={{ padding: "28px", height: "fit-content" }}>
                  <h3 style={{ fontSize: "18px", color: "var(--white)", marginBottom: "24px" }}>Add New Airline</h3>
                  <form onSubmit={handleAddAirline}>
                    <div className="input-group">
                      <label className="input-label">Airline Name</label>
                      <input className="input-field" placeholder="e.g. SkyConnect Express" value={airlineForm.name}
                        onChange={e => setAirlineForm({ name: e.target.value })} />
                    </div>
                    <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Register Airline</button>
                  </form>
                </div>

                <div className="glass-card" style={{ padding: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "18px", color: "var(--white)" }}>Active Fleet</h3>
                    <span className="badge badge-warning">{airlines.length} Registered</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>ID</th>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>AIRLINE NAME</th>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>STATUS</th>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {airlines.map(a => (
                          <tr key={a.airlineId} style={{ borderBottom: "1px solid var(--glass-light)" }}>
                            <td style={{ padding: "16px 12px", color: "var(--text-dim)" }}>#{a.airlineId}</td>
                            <td style={{ padding: "16px 12px", fontWeight: "700" }}>{a.name}</td>
                            <td style={{ padding: "16px 12px" }}>
                              <span className={`badge badge-${a.status === 'ACTIVE' ? 'success' : 'danger'}`}>{a.status}</span>
                            </td>
                            <td style={{ padding: "16px 12px" }}>
                              <button 
                                className={`btn ${a.status === 'BLOCKED' ? 'btn-primary' : 'btn-danger'}`} 
                                style={{ padding: "6px 14px", fontSize: "11px" }}
                                onClick={() => setConfirmModal({ airline: a, action: a.status === 'BLOCKED' ? "UNBLOCK" : "BLOCK" })}
                              >
                                {a.status === 'BLOCKED' ? "Unblock" : "Block"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Add Flight" && (
              <div className="glass-card" style={{ padding: "40px", maxWidth: "800px" }}>
                <h3 style={{ fontSize: "20px", color: "var(--white)", marginBottom: "32px" }}>Schedule New Flight</h3>
                <form onSubmit={handleAddFlight}>
                  <div className="grid grid-cols-2">
                    <div className="input-group">
                      <label className="input-label">Flight Number</label>
                      <input className="input-field" placeholder="SK101" value={flightForm.flightNumber} 
                        onChange={e => setFlightForm({...flightForm, flightNumber: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Airline ID</label>
                      <input className="input-field" type="number" placeholder="1" value={flightForm.airlineId}
                        onChange={e => setFlightForm({...flightForm, airlineId: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="input-group">
                      <label className="input-label">From City</label>
                      <input className="input-field" placeholder="Mumbai" value={flightForm.fromPlace}
                        onChange={e => setFlightForm({...flightForm, fromPlace: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">To City</label>
                      <input className="input-field" placeholder="Delhi" value={flightForm.toPlace}
                        onChange={e => setFlightForm({...flightForm, toPlace: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="input-group">
                      <label className="input-label">Departure Schedule</label>
                      <input className="input-field" type="datetime-local" value={flightForm.departureTime}
                        onChange={e => setFlightForm({...flightForm, departureTime: e.target.value})} style={{ colorScheme: "dark" }} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Arrival Schedule</label>
                      <input className="input-field" type="datetime-local" value={flightForm.arrivalTime}
                        onChange={e => setFlightForm({...flightForm, arrivalTime: e.target.value})} style={{ colorScheme: "dark" }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="input-group">
                      <label className="input-label">Economy Cap</label>
                      <input className="input-field" type="number" value={flightForm.economySeats}
                        onChange={e => setFlightForm({...flightForm, economySeats: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Business Cap</label>
                      <input className="input-field" type="number" value={flightForm.businessSeats}
                        onChange={e => setFlightForm({...flightForm, businessSeats: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Base Ticket Cost</label>
                      <input className="input-field" type="number" value={flightForm.ticketCost}
                        onChange={e => setFlightForm({...flightForm, ticketCost: e.target.value})} />
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit" style={{ marginTop: "12px", padding: "14px 40px" }}>Create Flight Schedule</button>
                </form>
              </div>
            )}

            {activeTab === "All Bookings" && (
              <div className="glass-card" style={{ padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", color: "var(--white)" }}>System-wide Bookings</h3>
                  <span className="badge badge-success">{bookings.length} Total</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>REFERENCE</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>CUSTOMER</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>FLIGHT</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>ROUTE</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>CABIN</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>REVENUE</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.bookingId} style={{ borderBottom: "1px solid var(--glass-light)" }}>
                          <td style={{ padding: "16px 12px", fontWeight: "800", color: "var(--accent)" }}>{b.bookingReference}</td>
                          <td style={{ padding: "16px 12px", fontSize: "13px" }}>ID: {b.userId}</td>
                          <td style={{ padding: "16px 12px", fontWeight: "700" }}>{b.flightNumber}</td>
                          <td style={{ padding: "16px 12px", fontSize: "13px" }}>{b.fromPlace} → {b.toPlace}</td>
                          <td style={{ padding: "16px 12px" }}><span className="badge badge-warning" style={{ fontSize: "10px" }}>{b.seatClass}</span></td>
                          <td style={{ padding: "16px 12px", fontWeight: "700" }}>₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "16px 12px" }}>
                            <span className={`badge badge-${b.status?.toLowerCase() === 'confirmed' ? 'success' : 'danger'}`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div className="glass-card animate-slide-up" style={{ padding: "40px", maxWidth: "400px", textAlign: "center", borderTop: `4px solid ${confirmModal.action === 'BLOCK' ? 'var(--danger)' : 'var(--success)'}` }}>
            <h3 style={{ color: "var(--white)", marginBottom: "16px" }}>Confirm Action</h3>
            <p style={{ color: "var(--text-dim)", marginBottom: "32px" }}>Are you sure you want to <strong>{confirmModal.action.toLowerCase()}</strong> the airline <strong>{confirmModal.airline.name}</strong>?</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className={`btn ${confirmModal.action === 'BLOCK' ? 'btn-danger' : 'btn-primary'}`} style={{ flex: 1 }} onClick={handleStatusChange}>Confirm</button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
