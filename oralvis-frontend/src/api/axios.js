import axios from "axios";

// Set base URL here (change if needed for production)
export const API_BASE_URL = "https://oralvis-flvs.onrender.com";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
