import axios from "axios";

// This module was imported by ContactUs.jsx / Searchtxt.jsx but did not exist,
// which broke the whole build. Single axios instance for the entire app.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5008";

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach the JWT automatically on every request.
apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    // Corrupted localStorage – just send the request unauthenticated.
  }
  return config;
});

// A 401 means the stored token is dead; clear it so the app stops pretending
// the user is logged in.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
