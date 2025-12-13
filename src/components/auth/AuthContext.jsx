import React, { createContext, useState, useEffect } from "react";
import { getUser, getToken, isAuthenticated, signup, signin, logout } from "./auth-helper";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();

    if (token && isAuthenticated()) {
      setUser(storedUser);
      setIsAuth(true);
    } else {
      setIsAuth(false);
      setUser(null);
    }

    setLoading(false);
  }, []);

  const handleSignup = async (uid, displayName, email, password, role = "student") => {
    setLoading(true);
    setError(null);

    try {
      const result = await signup(uid, displayName, email, password, role);

      if (result.success) {
        setUser(result.user);
        setIsAuth(true);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = err.message || "Signup failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signin(email, password);

      if (result.success) {
        setUser(result.user);
        setIsAuth(true);
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = err.message || "Signin failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuth(false);
  };

  const value = {
    user,
    isAuth,
    loading,
    error,
    signup: handleSignup,
    signin: handleSignin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
