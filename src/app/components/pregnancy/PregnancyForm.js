import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const PregnancyForm = ({ onSave }) => {
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    start_date: "",
    due_date: "",
    current_week: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/pregnancy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        setFormData({ start_date: "", due_date: "", current_week: 1 });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save pregnancy data");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const calculateDueDate = (startDate) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const due = new Date(start);
    due.setDate(due.getDate() + 280); // 40 weeks
    return due.toISOString().split("T")[0];
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setFormData({
      ...formData,
      start_date: startDate,
      due_date: calculateDueDate(startDate),
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Start Your Pregnancy Journey
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Menstrual Period (LMP) Date
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={handleStartDateChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Due Date
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Week of Pregnancy
          </label>
          <input
            type="number"
            min="1"
            max="42"
            value={formData.current_week}
            onChange={(e) =>
              setFormData({
                ...formData,
                current_week: parseInt(e.target.value),
              })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Start Tracking Pregnancy"}
        </button>
      </form>
    </div>
  );
};

export default PregnancyForm;
