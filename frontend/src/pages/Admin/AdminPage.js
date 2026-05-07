import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { getAirlines, addAirline, blockAirline, unblockAirline, addFlight, getAllBookings, getAllFlights, updateFlight, getAllUsers } from "../../services/api";
import { formatTime, formatDate } from "../../utils/dateUtils";

const TABS = ["Airlines", "Add Flight", "Manage Flights", "All Bookings"];

const getAirlineInfo = (flightNumber) => {
  if (!flightNumber) return { name: "SkyConnect Air", logo: "✈", color: "var(--accent)" };
  const prefix = flightNumber.substring(0, 2).toUpperCase();
  switch (prefix) {
    case "6E": return { name: "IndiGo", logo: "https://images.kiwi.com/airlines/64/6E.png", color: "#001B94" };
    case "AI": return { name: "Air India", logo: "https://images.kiwi.com/airlines/64/AI.png", color: "#ED1B24" };
    case "UK": return { name: "Vistara", logo: "https://images.kiwi.com/airlines/64/UK.png", color: "#3B1449" };
    case "SG": return { name: "SpiceJet", logo: "https://images.kiwi.com/airlines/64/SG.png", color: "#F60000" };
    case "QP": return { name: "Akasa Air", logo: "https://images.kiwi.com/airlines/64/QP.png", color: "#FF6A00" };
    case "I5": return { name: "AirAsia India", logo: "https://images.kiwi.com/airlines/64/I5.png", color: "#FF0000" };
    default: return { name: "SkyConnect Air", logo: "✈", color: "var(--accent)" };
  }
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Airlines");
  const [airlines, setAirlines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editingFlight, setEditingFlight] = useState(null);

  const [airlineForm, setAirlineForm] = useState({ name: "", contactNumber: "", officeAddress: "" });
  const [flightForm, setFlightForm] = useState({
    flightNumber: "", airlineId: "", fromPlace: "", toPlace: "",
    departureTime: "", arrivalTime: "", economySeats: "", businessSeats: "",
    ticketCost: "", mealType: "VEG",
  });
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

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

  const loadAllFlights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllFlights();
      setAllFlights(data);
    }
    catch { showToast("Failed to load flights", "error"); }
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

  const loadAllUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setAllUsers(data);
    } catch { console.warn("Failed to load users"); }
  }, []);

  useEffect(() => {
    if (activeTab === "Airlines") loadAirlines();
    if (activeTab === "All Bookings") {
      loadBookings();
      loadAllFlights();
      loadAllUsers();
    }
    if (activeTab === "Manage Flights") loadAllFlights();
  }, [activeTab, loadAirlines, loadBookings, loadAllFlights, loadAllUsers]);

  const handleAddAirline = async (e) => {
    e.preventDefault();
    if (!airlineForm.name) { showToast("Airline name required", "error"); return; }
    try {
      await addAirline(airlineForm);
      setAirlineForm({ name: "", contactNumber: "", officeAddress: "" });
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

    if (new Date(flightForm.departureTime) < new Date()) {
      showToast("Departure time cannot be in the past", "error");
      return;
    }

    if (new Date(flightForm.arrivalTime) <= new Date(flightForm.departureTime)) {
      showToast("Arrival time must be after departure time", "error");
      return;
    }
    try {
      await addFlight({
        ...flightForm,
        airlineId: Number(flightForm.airlineId),
        economySeats: Number(flightForm.economySeats),
        businessSeats: Number(flightForm.businessSeats),
        ticketCost: Number(flightForm.ticketCost),
        departureTime: flightForm.departureTime.includes("T") ? flightForm.departureTime + ":00" : flightForm.departureTime,
        arrivalTime: flightForm.arrivalTime.includes("T") ? flightForm.arrivalTime + ":00" : flightForm.arrivalTime,
      });
      setFlightForm({ flightNumber: "", airlineId: "", fromPlace: "", toPlace: "", departureTime: "", arrivalTime: "", economySeats: "", businessSeats: "", ticketCost: "", mealType: "VEG" });
      showToast("Flight added successfully!");
    } catch (err) { showToast("Failed to add flight", "error"); }
  };

  const handleUpdateFlight = async (e) => {
    e.preventDefault();

    if (new Date(editingFlight.departureTime) < new Date()) {
      showToast("Departure time cannot be in the past", "error");
      return;
    }

    if (new Date(editingFlight.arrivalTime) <= new Date(editingFlight.departureTime)) {
      showToast("Arrival time must be after departure time", "error");
      return;
    }
    try {
      await updateFlight(editingFlight.flightId, {
        ...editingFlight, mealType: editingFlight.mealType || "VEG",
        departureTime: editingFlight.departureTime.includes("T") ? editingFlight.departureTime + ":00" : editingFlight.departureTime,
        arrivalTime: editingFlight.arrivalTime.includes("T") ? editingFlight.arrivalTime + ":00" : editingFlight.arrivalTime,
      });
      showToast("Flight updated successfully!");
      setEditingFlight(null);
      loadAllFlights();
    } catch (err) { showToast("Update failed", "error"); }
  };

  return (
    <div className="app-container" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {toast && (
        <div className={`badge badge-${toast.type === 'error' ? 'danger' : 'success'}`}
          style={{ position: "fixed", top: "100px", right: "40px", zIndex: 1000, padding: "12px 24px", boxShadow: "var(--shadow-lg)" }}>
          {toast.msg}
        </div>
      )}

      <main className="scroll-area" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="container" style={{ maxWidth: "1440px", width: "95%", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: "24px" }}>

          <div style={{ marginBottom: "32px", flexShrink: 0, marginTop: "24px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h1 style={{ fontSize: "32px", color: "var(--text-heading)", marginBottom: "4px" }}>Admin Command Center</h1>
              <p style={{ color: "var(--text-dim)" }}>Manage airline registry, flight schedules, and customer bookings.</p>
            </div>
            <div style={{ display: "flex", gap: "8px", background: "var(--glass-light)", padding: "6px", borderRadius: "12px", width: "fit-content" }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "13px", color: activeTab === tab ? "#fff" : "var(--text-main)" }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-slide-up" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
            {activeTab === "Airlines" && (
              <div className="grid grid-cols-3" style={{ gridTemplateColumns: "350px 1fr", gap: "32px", height: "100%", overflow: "hidden" }}>
                <div className="glass-card" style={{ padding: "28px", height: "fit-content", flexShrink: 0 }}>
                  <h3 style={{ fontSize: "18px", color: "var(--white)", marginBottom: "24px" }}>Add New Airline</h3>
                  <form onSubmit={handleAddAirline}>
                    <div className="input-group">
                      <label className="input-label">Airline Name</label>
                      <input className="input-field" placeholder="e.g. SkyConnect Express" value={airlineForm.name}
                        onChange={e => setAirlineForm({ ...airlineForm, name: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Contact Number</label>
                      <input className="input-field" placeholder="e.g. +91 9876543210" value={airlineForm.contactNumber}
                        onChange={e => setAirlineForm({ ...airlineForm, contactNumber: e.target.value })} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Office Address</label>
                      <input className="input-field" placeholder="e.g. 123 Skyway, Aviation City" value={airlineForm.officeAddress}
                        onChange={e => setAirlineForm({ ...airlineForm, officeAddress: e.target.value })} />
                    </div>
                    <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Register Airline</button>
                  </form>
                </div>

                <div className="glass-card" style={{ padding: "28px", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", flexShrink: 0 }}>
                    <h3 style={{ fontSize: "18px", color: "var(--white)" }}>Active Fleet</h3>
                    <span className="badge badge-warning">{airlines.length} Registered</span>
                  </div>
                  <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>LOGO</th>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>AIRLINE NAME</th>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>STATUS</th>
                          <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "12px" }}>OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {airlines.map(a => {
                          const info = getAirlineInfo(a.name === "IndiGo" ? "6E" : a.name === "Air India" ? "AI" : a.name === "Vistara" ? "UK" : a.name === "SpiceJet" ? "SG" : a.name === "Akasa Air" ? "QP" : "");
                          return (
                            <tr key={a.airlineId} style={{ borderBottom: "1px solid var(--glass-light)" }}>
                              <td style={{ padding: "16px 12px" }}>
                                {info.logo.startsWith("http") ? (
                                  <img src={info.logo} alt="logo" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fff", padding: "2px" }} />
                                ) : (
                                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✈</div>
                                )}
                              </td>
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
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Add Flight" && (
              <div className="glass-card" style={{ padding: "40px", width: "100%", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "20px", color: "var(--white)" }}>Schedule New Flight</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Fill all details to broadcast flight availability.</p>
                </div>
                <form onSubmit={handleAddFlight}>
                  <div className="grid grid-cols-3" style={{ gap: "24px", marginBottom: "24px" }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Flight Number</label>
                      <input className="input-field" placeholder="e.g. SK101" value={flightForm.flightNumber}
                        onChange={e => setFlightForm({ ...flightForm, flightNumber: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Airline Carrier</label>
                      <select className="input-field" value={flightForm.airlineId}
                        onChange={e => setFlightForm({ ...flightForm, airlineId: e.target.value })}>
                        <option value="">Select Airline</option>
                        {airlines.filter(a => a.status === 'ACTIVE').map(a => (
                          <option key={a.airlineId} value={a.airlineId}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Meal Service</label>
                      <select className="input-field" value={flightForm.mealType}
                        onChange={e => setFlightForm({ ...flightForm, mealType: e.target.value })}>
                        <option value="VEG">Vegetarian Only</option>
                        <option value="NON_VEG">Non-Vegetarian</option>
                        <option value="NONE">No Meal Service</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2" style={{ gap: "24px", marginBottom: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Origin City</label>
                        <input className="input-field" placeholder="Mumbai" value={flightForm.fromPlace}
                          onChange={e => setFlightForm({ ...flightForm, fromPlace: e.target.value })} />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Destination City</label>
                        <input className="input-field" placeholder="Delhi" value={flightForm.toPlace}
                          onChange={e => setFlightForm({ ...flightForm, toPlace: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Departure</label>
                        <input
                          className="input-field"
                          type="datetime-local"
                          min={getCurrentDateTimeLocal()}
                          value={flightForm.departureTime}
                          onChange={e =>
                            setFlightForm({
                              ...flightForm,
                              departureTime: e.target.value,
                              arrivalTime:
                                flightForm.arrivalTime && flightForm.arrivalTime <= e.target.value
                                  ? ""
                                  : flightForm.arrivalTime
                            })
                          }
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Arrival</label>
                        <input
                          className="input-field"
                          type="datetime-local"
                          min={flightForm.departureTime || getCurrentDateTimeLocal()}
                          value={flightForm.arrivalTime}
                          onChange={e => setFlightForm({ ...flightForm, arrivalTime: e.target.value })}
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3" style={{ gap: "24px", marginBottom: "32px" }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Economy Capacity</label>
                      <input className="input-field" type="number" placeholder="180" value={flightForm.economySeats}
                        onChange={e => setFlightForm({ ...flightForm, economySeats: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Business Capacity</label>
                      <input className="input-field" type="number" placeholder="24" value={flightForm.businessSeats}
                        onChange={e => setFlightForm({ ...flightForm, businessSeats: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Base Fare (₹)</label>
                      <input className="input-field" type="number" placeholder="4500" value={flightForm.ticketCost}
                        onChange={e => setFlightForm({ ...flightForm, ticketCost: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="btn btn-primary" type="submit" style={{ padding: "14px 60px", fontSize: "16px" }}>Publish Flight Schedule</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "Manage Flights" && (
              <div className="glass-card" style={{ padding: "28px", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", color: "var(--white)" }}>Current Flight Schedules</h3>
                  <span className="badge badge-info">{allFlights.length} Active</span>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>FLIGHT</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>ROUTE</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>DEPARTURE</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>PRICE</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>SEATS</th>
                        <th style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFlights.map(f => (
                        <tr key={f.flightId} style={{ borderBottom: "1px solid var(--glass-light)" }}>
                          <td style={{ padding: "14px 12px" }}>
                            <div style={{ fontWeight: "700" }}>{f.flightNumber}</div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{getAirlineInfo(f.flightNumber).name}</div>
                          </td>
                          <td style={{ padding: "14px 12px", fontSize: "13px" }}>{f.fromPlace} → {f.toPlace}</td>
                          <td style={{ padding: "14px 12px", fontSize: "13px" }}>
                            <div>{formatTime(f.departureTime)}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{formatDate(f.departureTime)}</div>
                          </td>
                          <td style={{ padding: "14px 12px", fontWeight: "700", color: "var(--accent)" }}>₹{f.ticketCost}</td>
                          <td style={{ padding: "14px 12px", fontSize: "12px" }}>
                            E:{f.economySeats} | B:{f.businessSeats}
                          </td>
                          <td style={{ padding: "14px 12px" }}>
                            <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: "11px" }}
                              onClick={() => setEditingFlight({ ...f, departureTime: f.departureTime.substring(0, 16), arrivalTime: f.arrivalTime.substring(0, 16) })}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "All Bookings" && (
              <div className="glass-card" style={{ padding: "28px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", flexShrink: 0 }}>
                  <h3 style={{ fontSize: "18px", color: "var(--text-heading)" }}>System-wide Bookings</h3>
                  <span className="badge badge-success">{bookings.length} Total</span>
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
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
                      {bookings.map(b => {
                        const flight = allFlights.find(f => String(f.flightId) === String(b.flightId));
                        const user = allUsers.find(u => String(u.userId).toLowerCase() === String(b.userId).toLowerCase());

                        return (
                          <tr key={b.bookingId} style={{ borderBottom: "1px solid var(--glass-light)" }}>
                            <td style={{ padding: "16px 12px", fontWeight: "800", color: "var(--accent)" }}>{b.bookingReference}</td>
                            <td style={{ padding: "16px 12px", fontSize: "13px" }}>
                              <div style={{ fontWeight: "700", color: "var(--text-heading)" }}>{user ? user.fullName : "Unknown User"}</div>
                              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{b.userId?.substring(0, 8)}...</div>
                            </td>
                            <td style={{ padding: "16px 12px", fontWeight: "700", color: "var(--text-main)" }}>{flight ? flight.flightNumber : "N/A"}</td>
                            <td style={{ padding: "16px 12px", fontSize: "13px", color: "var(--text-main)" }}>
                              {flight ? `${flight.fromPlace} → ${flight.toPlace}` : "N/A"}
                            </td>
                            <td style={{ padding: "16px 12px" }}><span className="badge badge-warning" style={{ fontSize: "10px" }}>{b.seatClass}</span></td>
                            <td style={{ padding: "16px 12px", fontWeight: "700" }}>₹{Number(b.totalPrice || 0).toLocaleString("en-IN")}</td>
                            <td style={{ padding: "16px 12px" }}>
                              <span className={`badge badge-${b.status?.toLowerCase() === 'confirmed' ? 'success' : 'danger'}`}>{b.status}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {editingFlight && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div className="glass-card animate-slide-up" style={{ padding: "40px", maxWidth: "600px", width: "90%", borderTop: "4px solid var(--accent)" }}>
            <h3 style={{ color: "var(--white)", marginBottom: "24px" }}>Update Flight {editingFlight.flightNumber}</h3>
            <form onSubmit={handleUpdateFlight}>
              <div className="grid grid-cols-2" style={{ gap: "16px" }}>
                <div className="input-group">
                  <label className="input-label">Origin City</label>
                  <input
                    className="input-field"
                    value={editingFlight.fromPlace}
                    onChange={e =>
                      setEditingFlight({ ...editingFlight, fromPlace: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Destination City</label>
                  <input
                    className="input-field"
                    value={editingFlight.toPlace}
                    onChange={e =>
                      setEditingFlight({ ...editingFlight, toPlace: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2" style={{ gap: "16px" }}>
                <div className="input-group">
                  <label className="input-label">Departure</label>
                  <input
                    className="input-field"
                    type="datetime-local"
                    min={getCurrentDateTimeLocal()}
                    value={editingFlight.departureTime}
                    onChange={e =>
                      setEditingFlight({
                        ...editingFlight,
                        departureTime: e.target.value,
                        arrivalTime:
                          editingFlight.arrivalTime && editingFlight.arrivalTime <= e.target.value
                            ? ""
                            : editingFlight.arrivalTime
                      })
                    }
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Arrival</label>
                  <input
                    className="input-field"
                    type="datetime-local"
                    min={editingFlight.departureTime || getCurrentDateTimeLocal()}
                    value={editingFlight.arrivalTime}
                    onChange={e => setEditingFlight({ ...editingFlight, arrivalTime: e.target.value })}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2" style={{ gap: "16px" }}>
                <div className="input-group">
                  <label className="input-label">Ticket Cost (₹)</label>
                  <input className="input-field" type="number" value={editingFlight.ticketCost}
                    onChange={e => setEditingFlight({ ...editingFlight, ticketCost: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Economy Capacity</label>
                  <input className="input-field" type="number" value={editingFlight.economySeats}
                    onChange={e => setEditingFlight({ ...editingFlight, economySeats: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>Save Changes</button>
                <button className="btn btn-ghost" type="button" style={{ flex: 1 }} onClick={() => setEditingFlight(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
