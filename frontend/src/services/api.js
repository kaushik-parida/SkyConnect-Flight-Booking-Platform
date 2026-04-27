import axios from "axios";
const API = axios.create({baseURL: "http://localhost:8081/api/v1",});
export const login = (data) => axios.post("http://localhost:8080/auth/login", data);
export const getAirlines = () => API.get("/airlines");
export const blockAirline = (id) => API.put(`/airlines/${id}/block`);
export const unblockAirline = (id) => API.put(`/airlines/${id}/unblock`);
export default API;