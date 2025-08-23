"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

// Create the context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [moods, setMoods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if token is expired
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }, []);

  // Clear authentication state
  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    setCycles([]);
    setMoods([]);
    setSymptoms([]);
    localStorage.removeItem("token");
  }, []);

  // Load token and user on app mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken || isTokenExpired(savedToken)) {
      clearAuth();
      return;
    }

    try {
      const decoded = jwtDecode(savedToken);
      setToken(savedToken);
      setUser({
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      });

      // Fetch additional user data
      fetchUser(savedToken);
    } catch (err) {
      console.error("Error decoding token:", err);
      clearAuth();
    }
  }, [isTokenExpired, clearAuth]);

  // Fetch user profile data
  const fetchUser = async (authToken) => {
    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        // Token is invalid
        clearAuth();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({ ...prev, ...data }));
      } else {
        console.error("Failed to fetch user profile:", res.status);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  // Fetch cycles from backend
  const fetchCycles = useCallback(async () => {
    if (!token || isTokenExpired(token)) {
      clearAuth();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/cycles", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        clearAuth();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setCycles(Array.isArray(data) ? data : []);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${res.status}: Failed to fetch cycles`
        );
      }
    } catch (err) {
      console.error("Failed to fetch cycles:", err);
      setError(err.message || "Failed to load cycle data");
      setCycles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [token, isTokenExpired, clearAuth]);

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();

      if (!data.token) {
        throw new Error("No authentication token received");
      }

      // Store token
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // Decode and set user
      const decoded = jwtDecode(data.token);
      const userData = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearAuth();
    // Optionally redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, [clearAuth]);

  // Auto-fetch cycles when user logs in
  useEffect(() => {
    if (token && user) {
      fetchCycles();
    }
  }, [token, user, fetchCycles]);

  // Set up token expiration check
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(token)) {
        logout();
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, isTokenExpired, logout]);

  const contextValue = {
    // State
    user,
    setUser,
    token,
    setToken,
    cycles,
    setCycles,
    moods,
    setMoods,
    symptoms,
    setSymptoms,
    loading,
    error,

    // Actions
    fetchCycles,
    login,
    logout,
    clearAuth,

    // Utilities
    isTokenExpired: (t = token) => isTokenExpired(t),
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook for easy access
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
