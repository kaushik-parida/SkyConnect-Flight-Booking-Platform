import React from "react";
function AirlineTable({ airlines }) {
  return (
    <div className="container mt-4">
      <h3>Airlines</h3>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {airlines.map((a) => (
            <tr key={a.airlineId}>
              <td>{a.airlineId}</td>
              <td>{a.airlineName}</td>
              <td>{a.airlineCode}</td>
              <td>
                {a.isBlocked ? (
                  <span className="badge bg-danger">Blocked</span>
                ) : (
                  <span className="badge bg-success">Active</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AirlineTable;