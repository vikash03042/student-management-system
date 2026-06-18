import { jwtDecode } from "jwt-decode";

export const setToken = (token, role, name, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  if (name) localStorage.setItem("name", name);
  if (email) localStorage.setItem("email", email);
};

export const getToken = () => localStorage.getItem("token");
export const getUserRole = () => localStorage.getItem("role");
export const getUserName = () => localStorage.getItem("name");
export const getUserEmail = () => localStorage.getItem("email");

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};