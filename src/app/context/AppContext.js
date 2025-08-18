"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store logged-in user
  const [token, setToken] = useState(null); // Auth token
  const [cycles, setCycles] = useState([]);
  const [moods, setMoods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load token and user on app mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    }
  }, []);

  const fetchUser = async (authToken) => {
    try {
      const res = await fetch("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setToken(null);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  // Fetch cycles from backend
  const fetchCycles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/cycles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCycles(data);
      }
    } catch (err) {
      console.error("Failed to fetch cycles:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
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
        fetchCycles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy access
export const useAppContext = () => useContext(AppContext);
