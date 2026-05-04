import axios from "axios";
const authAPI = axios.create({
  baseURL: "http://localhost:8081",
});
const flightAPI = axios.create({
  baseURL: "http://localhost:8082/api/v1.0",
});
export const login = async (data) => {
  try {
    const response = await authAPI.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};
export const getAirlines = async () => {
  try {
    const response = await flightAPI.get("flights/airline");
    return response.data;
  } catch (error) {
    console.error("Get Airlines Error:", error);
    throw error;
  }
};
export const addAirline = async (data) => {
  try {
    const response = await flightAPI.post("/flights/airline/register", data);
    return response.data;
  } catch (error) {
    console.error("Add Airline Error:", error);
    throw error;
  }
};
export const blockAirline = async (id) => {
  try {
    const response = await flightAPI.put(
      `/flights/airline/${id}`,
      "BLOCKED",
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Block Airline Error:", error);
    throw error;
  }
};
export const unblockAirline = async (id) => {
  try {
    const response = await flightAPI.put(
      `/flights/airline/${id}`,
      "ACTIVE",
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Unblock Airline Error:", error);
    throw error;
  }
};
export const searchFlights = async (data) => {
  try {
    const response = await flightAPI.post("/flight/search", data);
    return response.data;
  } catch (error) {
    console.error("Search Flights Error:", error);
    throw error;
  }
};
export const addFlight = async (data) => {
  const res = await flightAPI.post("/flights", data, {
    headers: {
      "X-User-Role": "ADMIN",
    },
  });
  return res.data;
};

