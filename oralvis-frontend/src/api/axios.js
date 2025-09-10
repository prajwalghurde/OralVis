import axios from "axios";

// Fallback to localhost if env variable is missing
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({ baseURL: API_BASE_URL });

// Attach token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
export { API_BASE_URL }; // export base URL for frontend use
