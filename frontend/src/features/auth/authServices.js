import apiClient from "../../api/client.js";

// Register User
const register = async (userData) => {
  const { data } = await apiClient.post("/api/auth/register", userData);
  if (data?.token) {
    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
};

// Login User
const login = async (userData) => {
  const { data } = await apiClient.post("/api/auth/login", userData);
  if (data?.token) {
    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
};

// Logout User
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
