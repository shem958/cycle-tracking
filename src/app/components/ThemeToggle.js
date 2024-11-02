"use client";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    setIsDarkMode(savedTheme === "true");
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isDarkMode", newMode);
      return newMode;
    });
  };

  // Set body class based on the theme
  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-all"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );
};

export default ThemeToggle;
