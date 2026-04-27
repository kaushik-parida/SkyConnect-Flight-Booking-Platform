import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AirlineTable from "../components/AirlineTable";
import { getAirlines } from "../services/api";
function AdminPage() {
  const [airlines, setAirlines] = useState([]);
  useEffect(() => {
    getAirlines().then(setAirlines);
  }, []);
  return (
    <>
      <Navbar />
      <AirlineTable airlines={airlines} />
    </>
  );
}
export default AdminPage;