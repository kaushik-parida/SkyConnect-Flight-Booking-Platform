import axios from "axios";

const API_BASE = "http://localhost:3000";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/api/auth/users");
  return response.data;
};

export const searchFlights = async (data) => {
  const response = await api.post("/api/v1.0/flight/search", data);
  return response.data;
};

export const addFlight = async (data) => {
  const response = await api.post("/api/v1.0/flights", data);
  return response.data;
};

export const updateFlight = async (id, data) => {
  const response = await api.put(`/api/v1.0/flights/${id}`, data);
  return response.data;
};

export const getAllFlights = async () => {
  const response = await api.get("/api/v1.0/flights");
  return response.data;
};

export const getFlightById = async (id) => {
  const response = await api.get(`/api/v1.0/flights/${id}`);
  return response.data;
};

export const getAirlines = async () => {
  const response = await api.get("/api/v1.0/flights/airline");
  return response.data;
};

export const addAirline = async (data) => {
  const response = await api.post("/api/v1.0/flights/airline/register", data);
  return response.data;
};

export const blockAirline = async (id) => {
  const response = await api.put(`/api/v1.0/flights/airline/${id}`, { status: "BLOCKED" });
  return response.data;
};

export const unblockAirline = async (id) => {
  const response = await api.put(`/api/v1.0/flights/airline/${id}`, { status: "ACTIVE" });
  return response.data;
};

export const createBooking = async (flightId, data) => {
  const response = await api.post(`/api/v1.0/flight/booking/${flightId}`, data);
  return response.data;
};

export const getTicketByPnr = async (pnr) => {
  const response = await api.get(`/api/v1.0/flight/booking/ticket/${pnr}`);
  return response.data;
};

export const getBookingHistory = async (userId, page = 0, size = 10) => {
  const response = await api.get(`/api/v1.0/flight/booking/history/${userId}`, { params: { page, size } });
  return response.data;
};

export const cancelBooking = async (pnr, userId) => {
  const response = await api.patch(`/api/v1.0/flight/booking/cancel/${pnr}`, null, { params: { userId } });
  return response.data;
};

export const getAllBookings = async (page = 0, size = 10) => {
  const response = await api.get("/api/v1.0/flight/booking/admin/all", { params: { page, size } });
  return response.data;
};
