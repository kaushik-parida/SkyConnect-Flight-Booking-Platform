import React, { useState } from "react";
function FlightSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const handleSearch = () => {
    console.log(from, to);
  };
  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h4>Search Flights</h4>

        <div className="row">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="From"
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="To"
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FlightSearch;