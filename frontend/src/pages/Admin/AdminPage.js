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

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const toISOWithSeconds = (val) => {
  if (!val) return val;
  return val.includes("T") && val.length === 16 ? val + ":00" : val;
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
    } catch { showToast("Failed to load airlines", "error"); }
    finally { setLoading(false); }
  }, []);

  const loadAllFlights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllFlights();
      setAllFlights(data);
    } catch { showToast("Failed to load flights", "error"); }
    finally { setLoading(false); }
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data.content || []);
    } catch { showToast("Failed to load bookings", "error"); }
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
    if (activeTab === "Add Flight") loadAirlines();
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
    } catch { showToast("Failed to add airline", "error"); }
  };

  const handleStatusChange = async () => {
    if (!confirmModal) return;
    try {
      if (confirmModal.action === "BLOCK") await blockAirline(confirmModal.airline.airlineId);
      else await unblockAirline(confirmModal.airline.airlineId);
      showToast(`Airline ${confirmModal.action.toLowerCase()}ed`);
      setConfirmModal(null);
      loadAirlines();
    } catch { showToast("Action failed", "error"); }
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    if (new Date(flightForm.departureTime) < new Date()) {
      showToast("Departure time cannot be in the past", "error"); return;
    }
    if (new Date(flightForm.arrivalTime) <= new Date(flightForm.departureTime)) {
      showToast("Arrival time must be after departure time", "error"); return;
    }

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
        departureTime: toISOWithSeconds(flightForm.departureTime),
        arrivalTime: toISOWithSeconds(flightForm.arrivalTime),
      });
      setFlightForm({ flightNumber: "", airlineId: "", fromPlace: "", toPlace: "", departureTime: "", arrivalTime: "", economySeats: "", businessSeats: "", ticketCost: "", mealType: "VEG" });
      showToast("Flight added successfully!");
    } catch { showToast("Failed to add flight", "error"); }
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
        ...editingFlight,
        mealType: editingFlight.mealType || "VEG",
        departureTime: toISOWithSeconds(editingFlight.departureTime),
        arrivalTime: toISOWithSeconds(editingFlight.arrivalTime),
      });
      showToast("Flight updated successfully!");
      setEditingFlight(null);
      loadAllFlights();
    } catch { showToast("Update failed", "error"); }
  };

  return (
    <div className="app-container page-fixed-height">
      <Navbar />

      {toast && (
        <div className={`toast-notification badge badge-${toast.type === "error" ? "danger" : "success"}`}>
          {toast.msg}
        </div>
      )}

      <main className="scroll-area page-main">
        <div className="container admin-container">

          <div className="admin-header">
            <div>
              <h1 className="admin-page-title">Admin Command Center</h1>
              <p className="admin-page-subtitle">Manage airline registry, flight schedules, and customer bookings.</p>
            </div>
            <div className="admin-tab-bar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn ${activeTab === tab ? "btn-primary" : "btn-ghost"} admin-tab-btn`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-slide-up admin-content">
            {activeTab === "Airlines" && (
              <div className="admin-airlines-grid">
                <div className="glass-card admin-form-card">
                  <h3 className="card-title">Add New Airline</h3>
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

                <div className="glass-card admin-table-card">
                  <div className="card-header-row">
                    <h3 className="card-title">Active Fleet</h3>
                    <span className="badge badge-warning">{airlines.length} Registered</span>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>LOGO</th>
                          <th>AIRLINE NAME</th>
                          <th>STATUS</th>
                          <th>OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {airlines.map(a => {
                          const info = getAirlineInfo(
                            a.name === "IndiGo" ? "6E" : a.name === "Air India" ? "AI" :
                            a.name === "Vistara" ? "UK" : a.name === "SpiceJet" ? "SG" :
                            a.name === "Akasa Air" ? "QP" : ""
                          );
                          return (
                            <tr key={a.airlineId}>
                              <td>
                                {info.logo.startsWith("http") ? (
                                  <img src={info.logo} alt="logo" className="airline-logo-img" />
                                ) : (
                                  <div className="airline-logo-placeholder">✈</div>
                                )}
                              </td>
                              <td className="fw-700">{a.name}</td>
                              <td>
                                <span className={`badge badge-${a.status === "ACTIVE" ? "success" : "danger"}`}>{a.status}</span>
                              </td>
                              <td>
                                <button
                                  className={`btn ${a.status === "BLOCKED" ? "btn-primary" : "btn-danger"} btn-xs`}
                                  onClick={() => setConfirmModal({ airline: a, action: a.status === "BLOCKED" ? "UNBLOCK" : "BLOCK" })}
                                >
                                  {a.status === "BLOCKED" ? "Unblock" : "Block"}
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
              <div className="glass-card admin-addflight-card">
                <div className="card-header-row">
                  <h3 className="card-title">Schedule New Flight</h3>
                  <p className="card-subtitle">Fill all details to broadcast flight availability.</p>
                </div>
                <form onSubmit={handleAddFlight}>
                  <div className="grid grid-cols-3 mb-24">
                    <div className="input-group mb-0">
                      <label className="input-label">Flight Number</label>
                      <input className="input-field" placeholder="e.g. SK101" value={flightForm.flightNumber}
                        onChange={e => setFlightForm({ ...flightForm, flightNumber: e.target.value })} />
                    </div>
                    <div className="input-group mb-0">
                      <label className="input-label">Airline Carrier</label>
                      <select className="input-field" value={flightForm.airlineId}
                        onChange={e => setFlightForm({ ...flightForm, airlineId: e.target.value })}>
                        <option value="">Select Airline</option>
                        {airlines.filter(a => a.status === "ACTIVE").map(a => (
                          <option key={a.airlineId} value={a.airlineId}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group mb-0">
                      <label className="input-label">Meal Service</label>
                      <select className="input-field" value={flightForm.mealType}
                        onChange={e => setFlightForm({ ...flightForm, mealType: e.target.value })}>
                        <option value="VEG">Vegetarian Only</option>
                        <option value="NON_VEG">Non-Vegetarian</option>
                        <option value="NONE">No Meal Service</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mb-24">
                    <div className="two-col-subgrid">
                      <div className="input-group mb-0">
                        <label className="input-label">Origin City</label>
                        <input className="input-field" placeholder="Mumbai" value={flightForm.fromPlace}
                          onChange={e => setFlightForm({ ...flightForm, fromPlace: e.target.value })} />
                      </div>
                      <div className="input-group mb-0">
                        <label className="input-label">Destination City</label>
                        <input className="input-field" placeholder="Delhi" value={flightForm.toPlace}
                          onChange={e => setFlightForm({ ...flightForm, toPlace: e.target.value })} />
                      </div>
                    </div>
                    <div className="two-col-subgrid">
                      <div className="input-group mb-0">
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
                      <div className="input-group mb-0">
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

                  <div className="grid grid-cols-3 mb-32">
                    <div className="input-group mb-0">
                      <label className="input-label">Economy Capacity</label>
                      <input className="input-field" type="number" placeholder="180" value={flightForm.economySeats}
                        onChange={e => setFlightForm({ ...flightForm, economySeats: e.target.value })} />
                    </div>
                    <div className="input-group mb-0">
                      <label className="input-label">Business Capacity</label>
                      <input className="input-field" type="number" placeholder="24" value={flightForm.businessSeats}
                        onChange={e => setFlightForm({ ...flightForm, businessSeats: e.target.value })} />
                    </div>
                    <div className="input-group mb-0">
                      <label className="input-label">Base Fare (₹)</label>
                      <input className="input-field" type="number" placeholder="4500" value={flightForm.ticketCost}
                        onChange={e => setFlightForm({ ...flightForm, ticketCost: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-submit-row">
                    <button className="btn btn-primary btn-submit" type="submit">Publish Flight Schedule</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "Manage Flights" && (
              <div className="glass-card admin-table-card">
                <div className="card-header-row">
                  <h3 className="card-title">Current Flight Schedules</h3>
                  <span className="badge badge-info">{allFlights.length} Active</span>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>FLIGHT</th>
                        <th>ROUTE</th>
                        <th>DEPARTURE</th>
                        <th>PRICE</th>
                        <th>SEATS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFlights.map(f => (
                        <tr key={f.flightId}>
                          <td>
                            <div className="fw-700">{f.flightNumber}</div>
                            <div className="text-muted text-10">{getAirlineInfo(f.flightNumber).name}</div>
                          </td>
                          <td className="text-13">{f.fromPlace} → {f.toPlace}</td>
                          <td className="text-13">
                            <div>{formatTime(f.departureTime)}</div>
                            <div className="text-dim text-11">{formatDate(f.departureTime)}</div>
                          </td>
                          <td className="fw-700 text-accent">₹{f.ticketCost}</td>
                          <td className="text-12">E:{f.economySeats} | B:{f.businessSeats}</td>
                          <td>
                            <button className="btn btn-ghost btn-xs"
                            onClick={() => setEditingFlight({
                                ...f,
                                departureTime: f.departureTime ? f.departureTime.substring(0, 16) : "",
                                arrivalTime: f.arrivalTime ? f.arrivalTime.substring(0, 16) : "",
                                mealType: f.mealType || "VEG",
                              })}>
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
              <div className="glass-card admin-table-card">
                <div className="card-header-row">
                  <h3 className="card-title">System-wide Bookings</h3>
                  <span className="badge badge-success">{bookings.length} Total</span>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>REFERENCE</th>
                        <th>CUSTOMER</th>
                        <th>FLIGHT</th>
                        <th>ROUTE</th>
                        <th>CABIN</th>
                        <th>REVENUE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => {
                        const flight = allFlights.find(f => String(f.flightId) === String(b.flightId));
                        const user = allUsers.find(u => String(u.userId).toLowerCase() === String(b.userId).toLowerCase());
                        return (
                          <tr key={b.bookingId}>
                            <td className="fw-800 text-accent">{b.bookingReference}</td>
                            <td>
                              <div className="fw-700">{user ? user.fullName : "Unknown User"}</div>
                              <div className="text-muted text-10">{b.userId?.substring(0, 8)}...</div>
                            </td>
                            <td className="fw-700">{flight ? flight.flightNumber : "N/A"}</td>
                            <td className="text-13">{flight ? `${flight.fromPlace} → ${flight.toPlace}` : "N/A"}</td>
                            <td><span className="badge badge-warning text-10">{b.seatClass}</span></td>
                            <td className="fw-700">₹{Number(b.totalPrice || 0).toLocaleString("en-IN")}</td>
                            <td>
                              <span className={`badge badge-${b.status?.toLowerCase() === "confirmed" ? "success" : "danger"}`}>{b.status}</span>
                            </td>
                          </tr>
                        );
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
        <div className="modal-overlay">
          <div className="glass-card animate-slide-up modal-card modal-card-accent-top">
            <h3 className="modal-title">Update Flight {editingFlight.flightNumber}</h3>
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
              <div className="grid grid-cols-2">
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
              <div className="grid grid-cols-2">
                <div className="input-group">
                  <label className="input-label">Business Capacity</label>
                  <input className="input-field" type="number" value={editingFlight.businessSeats}
                    onChange={e => setEditingFlight({ ...editingFlight, businessSeats: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label">Meal Service</label>
                  <select className="input-field" value={editingFlight.mealType || "VEG"}
                    onChange={e => setEditingFlight({ ...editingFlight, mealType: e.target.value })}>
                    <option value="VEG">Vegetarian Only</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                    <option value="NONE">No Meal Service</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary modal-btn" type="submit">Save Changes</button>
                <button className="btn btn-ghost modal-btn" type="button" onClick={() => setEditingFlight(null)}>Cancel</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="modal-overlay">
          <div className={`glass-card animate-slide-up modal-card modal-card-text-center modal-card-${confirmModal.action === "BLOCK" ? "danger-top" : "success-top"}`}>
            <h3 className="modal-title">Confirm Action</h3>
            <p className="modal-desc">
              Are you sure you want to <strong>{confirmModal.action.toLowerCase()}</strong> the airline <strong>{confirmModal.airline.name}</strong>?
            </p>
            <div className="modal-actions">
              <button className={`btn ${confirmModal.action === "BLOCK" ? "btn-danger" : "btn-primary"} modal-btn`} onClick={handleStatusChange}>Confirm</button>
              <button className="btn btn-ghost modal-btn" onClick={() => setConfirmModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
