// Small helpers for reading the persisted auth session.
// (This file existed but was empty.)

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Corrupted entry — drop it rather than crashing the app on boot.
    localStorage.removeItem("user");
    return null;
  }
};

export const getToken = () => getStoredUser()?.token || null;

export const clearStoredUser = () => localStorage.removeItem("user");

// Decodes a JWT payload without verifying it (client-side expiry check only).
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const isLoggedIn = () => {
  const token = getToken();
  return Boolean(token) && !isTokenExpired(token);
};
