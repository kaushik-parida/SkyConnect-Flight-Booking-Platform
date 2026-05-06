import axios from "axios";

const API_BASE = "http://localhost:3000";

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const register = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const searchFlights = async (data) => {
  const res = await api.post("/api/v1.0/flight/search", data);
  return res.data;
};

export const addFlight = async (data) => {
  const res = await api.post("/api/v1.0/flights", data);
  return res.data;
};

export const getAirlines = async () => {
  const res = await api.get("/api/v1.0/flights/airline");
  return res.data;
};

export const addAirline = async (data) => {
  const res = await api.post("/api/v1.0/flights/airline/register", data);
  return res.data;
};

export const blockAirline = async (id) => {
  const res = await api.put(`/api/v1.0/flights/airline/${id}`, { status: "BLOCKED" });
  return res.data;
};

export const unblockAirline = async (id) => {
  const res = await api.put(`/api/v1.0/flights/airline/${id}`, { status: "ACTIVE" });
  return res.data;
};

export const createBooking = async (flightId, data) => {
  const res = await api.post(`/api/v1.0/flight/booking/${flightId}`, data);
  return res.data;
};

export const getTicketByPnr = async (pnr) => {
  const res = await api.get(`/api/v1.0/flight/booking/ticket/${pnr}`);
  return res.data;
};

export const getBookingHistory = async (userId, page = 0, size = 10) => {
  const res = await api.get(`/api/v1.0/flight/booking/history/${userId}`, { params: { page, size } });
  return res.data;
};

export const cancelBooking = async (pnr, userId) => {
  const res = await api.patch(`/api/v1.0/flight/booking/cancel/${pnr}`, null, { params: { userId } });
  return res.data;
};

export const getAllBookings = async (page = 0, size = 10) => {
  const res = await api.get("/api/v1.0/flight/booking/admin/all", { params: { page, size } });
  return res.data;
};
