import axios from "axios";
import { loadAuthState } from "../utils/storage.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const { token } = loadAuthState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error) =>
  error.response?.data?.message ||
  (error.code === "ERR_NETWORK"
    ? "Cannot reach the app services. Start both frontend and backend with `npm run dev` from the project root."
    : error.message) ||
  "Something went wrong.";

export default api;
