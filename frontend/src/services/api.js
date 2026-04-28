import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:8081",
});

const flightAPI = axios.create({
  baseURL: "http://localhost:8082/api/v1",
});

export const login = (data) => authAPI.post("/auth/login", data);

export const getAirlines = async () => {
  const res = await flightAPI.get("/airlines");
  return res.data;
};

export const addAirline = (data) => {
  return flightAPI.post("/airlines", data);
};

export const blockAirline = (id) => {
  return flightAPI.put(`/airlines/${id}/block`);
};

export const unblockAirline = (id) => {
  return flightAPI.put(`/airlines/${id}/unblock`);
};