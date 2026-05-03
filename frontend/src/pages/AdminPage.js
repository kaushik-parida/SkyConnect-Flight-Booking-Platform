import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import adminBg from "../assets/admin-background.jpg";
import {
  getAirlines,
  addAirline,
  blockAirline,
  unblockAirline,
} from "../services/api";
function AdminPage() {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionType, setActionType] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });
  const [flightForm, setFlightForm] = useState({
    airlineId: "",
    from: "",
    to: "",
    departureTime: "",
    price: "",
  });

  useEffect(() => {
    loadAirlines();
  }, []);

  const loadAirlines = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAirlines();
      setAirlines(data);
    } catch {
      setError("Failed to load airlines");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAdd = async () => {
    if (!form.name) {
      setError("Airline name required");
      return;
    }

    try {
      await addAirline(form);
      setForm({ name: "" });
      loadAirlines();
    } catch {
      setError("Error adding airline");
    }
  };

  const handleBlock = (airline) => {
    setSelectedAirline(airline);
    setActionType("BLOCK");
    setShowConfirm(true);
  };

  const handleUnblock = (airline) => {
    setSelectedAirline(airline);
    setActionType("UNBLOCK");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      if (actionType === "BLOCK") {
        await blockAirline(selectedAirline.airlineId);
      } else {
        await unblockAirline(selectedAirline.airlineId);
      }

      setShowConfirm(false);
      setSelectedAirline(null);
      setActionType("");
      loadAirlines();
    } catch {
      setError("Action failed");
    }
  };
  const handleFlightChange = (e) => {
    setFlightForm({
      ...flightForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddFlight = async () => {
    if (
      !flightForm.airlineId ||
      !flightForm.from ||
      !flightForm.to ||
      !flightForm.departureTime ||
      !flightForm.price
    ) {
      setError("All flight fields are required");
      return;
    }
    try {
      console.log("Flight Data:", flightForm);
      setFlightForm({
        airlineId: "",
        from: "",
        to: "",
        departureTime: "",
        price: "",
      });
      alert("Flight added (UI only)");
    } catch {
      setError("Error adding flight");
    }
  };
  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={styles.title}>Admin Dashboard</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.section}>
            <h3>Add Airline</h3>
            <input
              name="name"
              placeholder="Airline Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />
            <button style={styles.addBtn} onClick={handleAdd}>
              Add Airline
            </button>
          </div>
          <div style={styles.section}>
            <h3>Add Flight</h3>
            <input
              name="airlineId"
              placeholder="Airline ID"
              value={flightForm.airlineId}
              onChange={handleFlightChange}
              style={styles.input}
            />
            <input
              name="from"
              placeholder="From"
              value={flightForm.from}
              onChange={handleFlightChange}
              style={styles.input}
            />
            <input
              name="to"
              placeholder="To"
              value={flightForm.to}
              onChange={handleFlightChange}
              style={styles.input}
            />
            <input
              type="datetime-local"
              name="departureTime"
              value={flightForm.departureTime}
              onChange={handleFlightChange}
              style={styles.input}
            />
            <input
              name="price"
              placeholder="Price"
              value={flightForm.price}
              onChange={handleFlightChange}
              style={styles.input}
            />
            <button style={styles.addBtn} onClick={handleAddFlight}>
              Add Flight
            </button>
          </div>
          <div style={styles.section}>
            <h3>Manage Airlines</h3>

            {airlines.length === 0 && !loading && (
              <p>No airlines found</p>
            )}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {airlines.map((airline) => (
                  <tr key={airline.airlineId}>
                    <td>{airline.name}</td>
                    <td>{airline.status}</td>
                    <td>
                      {airline.status === "BLOCKED" ? (
                        <button
                          style={styles.unblockBtn}
                          onClick={() => handleUnblock(airline)}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          style={styles.blockBtn}
                          onClick={() => handleBlock(airline)}
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3>
              Are you sure you want to{" "}
              {actionType.toLowerCase()} this airline{" "}
              {selectedAirline?.name}?
            </h3>

            <div style={styles.modalActions}>
              <button style={styles.confirmBtn} onClick={handleConfirm}>
                Yes
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminPage;
const styles = {
  container: {
    backgroundImage: `url(${adminBg})`,
    backgroundSize: "cover",
    minHeight: "100vh",
  },
  overlay: {
    background: "rgba(0,0,0,0.6)",
    minHeight: "100vh",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "900px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    margin: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "200px",
  },
  addBtn: {
    padding: "10px",
    background: "#0071c2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  blockBtn: {
    background: "#ff4d4f",
    color: "white",
    padding: "6px",
    border: "none",
    borderRadius: "5px",
  },
  unblockBtn: {
    background: "#52c41a",
    color: "white",
    padding: "6px",
    border: "none",
    borderRadius: "5px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    background: "white",
    padding: "20px",
    margin: "200px auto",
    width: "350px",
    textAlign: "center",
  },
  confirmBtn: {
    background: "red",
    color: "white",
    padding: "8px",
    margin: "5px",
    border: "none",
  },
  cancelBtn: {
    padding: "8px",
    margin: "5px",
  },
  error: {
    color: "red",
  },
};