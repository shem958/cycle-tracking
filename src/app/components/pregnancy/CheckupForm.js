import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const CheckupForm = ({ onSave }) => {
  const { token, user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    week: "",
    checkup_date: new Date().toISOString().split("T")[0],
    weight: "",
    blood_pressure: "",
    doctor_notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const checkupData = {
        ...formData,
        weight: parseFloat(formData.weight),
        week: parseInt(formData.week),
      };

      const response = await fetch(
        "http://localhost:8080/api/pregnancy-checkups",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkupData),
        }
      );

      if (response.ok) {
        onSave();
        setFormData({
          week: "",
          checkup_date: new Date().toISOString().split("T")[0],
          weight: "",
          blood_pressure: "",
          doctor_notes: "",
        });
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save checkup");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
      >
        + Add New Checkup
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">New Pregnancy Checkup</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week of Pregnancy
            </label>
            <input
              type="number"
              min="1"
              max="42"
              value={formData.week}
              onChange={(e) =>
                setFormData({ ...formData, week: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Checkup Date
            </label>
            <input
              type="date"
              value={formData.checkup_date}
              onChange={(e) =>
                setFormData({ ...formData, checkup_date: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure
            </label>
            <input
              type="text"
              placeholder="120/80"
              value={formData.blood_pressure}
              onChange={(e) =>
                setFormData({ ...formData, blood_pressure: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doctor's Notes
          </label>
          <textarea
            value={formData.doctor_notes}
            onChange={(e) =>
              setFormData({ ...formData, doctor_notes: e.target.value })
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter any notes from your doctor..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save Checkup"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckupForm;
