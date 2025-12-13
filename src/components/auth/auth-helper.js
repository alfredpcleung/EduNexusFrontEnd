import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ========== TOKEN STORAGE ==========
const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("token");
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

// ========== USER STORAGE ==========
const setUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const getUser = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ========== AUTHENTICATION FLOWS ==========
const signup = async (uid, displayName, email, password, role = "student") => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        displayName,
        email,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true, user: data.data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "Signup failed. Please try again." };
  }
};

const signin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setToken(data.data.token);
      setUser(data.data.user);
      console.log('User signed in:', data.data.user); // Debug logging
      return { success: true, user: data.data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, message: "Signin failed. Please try again." };
  }
};

const logout = () => {
  removeToken();
};

// ========== AUTHENTICATED FETCH ==========
/**
 * Wrapper around fetch that automatically adds Authorization header with JWT token
 * @param {string} url - The URL to fetch from
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} - Fetch response
 */
const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token expiration - clone response to read body without consuming it
  if (response.status === 401) {
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();
    if (
      data.message === "Token has expired. Please sign in again." ||
      data.message === "Invalid token. Please authenticate."
    ) {
      logout();
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
  }

  return response;
};

// ========== LEGACY COMPATIBILITY ==========
const authenticate = (token, username, cb) => {
  setToken(token);
  if (typeof window !== "undefined") {
    localStorage.setItem("username", username);
  }
  if (typeof cb === "function") {
    cb();
  }
};

const getUsername = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("username");
};

const clearJWT = () => {
  logout();
  if (typeof window !== "undefined") {
    localStorage.removeItem("username");
  }
};

export {
  setToken,
  getToken,
  removeToken,
  isAuthenticated,
  setUser,
  getUser,
  signup,
  signin,
  logout,
  authenticatedFetch,
  authenticate,
  getUsername,
  clearJWT,
  API_BASE_URL,
};