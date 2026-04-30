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
  const [form, setForm] = useState({
    name: ""
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
      setForm({ name: ""});
      loadAirlines();
    } catch {
      setError("Error adding airline");
    }
  };
  const handleBlock = async (id) => {
    try {
      await blockAirline(id);
      loadAirlines();
    } catch {
      setError("Error blocking airline");
    }
  };
  const handleUnblock = async (id) => {
    try {
      await unblockAirline(id);
      loadAirlines();
    } catch {
      setError("Error unblocking airline");
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
            <h3>Manage Airlines</h3>
            {airlines.length === 0 && !loading && <p>No airlines found</p>}
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
                      {airline.status==="BLOCKED" ? (
                        <button
                          style={styles.unblockBtn}
                          onClick={() => handleUnblock(airline.airlineId)}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          style={styles.blockBtn}
                          onClick={() => handleBlock(airline.airlineId)}
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
  error: {
    color: "red",
  },
};