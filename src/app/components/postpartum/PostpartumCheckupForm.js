import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const MOOD_OPTIONS = [
  { value: 1, label: "Very Low", color: "text-red-600" },
  { value: 2, label: "Low", color: "text-red-400" },
  { value: 3, label: "Poor", color: "text-orange-500" },
  { value: 4, label: "Fair", color: "text-yellow-500" },
  { value: 5, label: "Okay", color: "text-yellow-400" },
  { value: 6, label: "Good", color: "text-green-400" },
  { value: 7, label: "Very Good", color: "text-green-500" },
  { value: 8, label: "Great", color: "text-green-600" },
  { value: 9, label: "Excellent", color: "text-blue-500" },
  { value: 10, label: "Perfect", color: "text-blue-600" },
];

const PostpartumCheckupForm = ({ onSave }) => {
  const { token, user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    checkup_date: new Date().toISOString().split("T")[0],
    days_postpartum: "",
    mood_rating: 5,
    pain_level: 0,
    sleep_quality: 5,
    breastfeeding_status: "",
    bleeding_status: "",
    energy_level: 5,
    notes: "",
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
        days_postpartum: parseInt(formData.days_postpartum),
        mood_rating: parseInt(formData.mood_rating),
        pain_level: parseInt(formData.pain_level),
        sleep_quality: parseInt(formData.sleep_quality),
        energy_level: parseInt(formData.energy_level),
      };

      const response = await fetch(
        "http://localhost:8080/api/postpartum-checkups",
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
          checkup_date: new Date().toISOString().split("T")[0],
          days_postpartum: "",
          mood_rating: 5,
          pain_level: 0,
          sleep_quality: 5,
          breastfeeding_status: "",
          bleeding_status: "",
          energy_level: 5,
          notes: "",
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
        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
      >
        + Log Recovery Checkup
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Postpartum Recovery Checkup</h3>
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
              Checkup Date
            </label>
            <input
              type="date"
              value={formData.checkup_date}
              onChange={(e) =>
                setFormData({ ...formData, checkup_date: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days Postpartum
            </label>
            <input
              type="number"
              min="0"
              value={formData.days_postpartum}
              onChange={(e) =>
                setFormData({ ...formData, days_postpartum: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mood Rating (1-10)
          </label>
          <div className="flex space-x-2 mb-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, mood_rating: mood.value })
                }
                className={`px-2 py-1 rounded text-sm ${
                  formData.mood_rating === mood.value
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {mood.value}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Current:{" "}
            {MOOD_OPTIONS.find((m) => m.value === formData.mood_rating)?.label}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pain Level (0-10)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.pain_level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pain_level: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <p className="text-sm text-gray-600 text-center">
              {formData.pain_level}/10
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep Quality (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.sleep_quality}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sleep_quality: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <p className="text-sm text-gray-600 text-center">
              {formData.sleep_quality}/10
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Energy Level (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.energy_level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  energy_level: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <p className="text-sm text-gray-600 text-center">
              {formData.energy_level}/10
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breastfeeding Status
            </label>
            <select
              value={formData.breastfeeding_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  breastfeeding_status: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="Exclusively breastfeeding">
                Exclusively breastfeeding
              </option>
              <option value="Mixed feeding">Mixed feeding</option>
              <option value="Formula feeding">Formula feeding</option>
              <option value="Not applicable">Not applicable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bleeding Status
            </label>
            <select
              value={formData.bleeding_status}
              onChange={(e) =>
                setFormData({ ...formData, bleeding_status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select status</option>
              <option value="Heavy">Heavy</option>
              <option value="Moderate">Moderate</option>
              <option value="Light">Light</option>
              <option value="Spotting">Spotting</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Any additional notes about your recovery..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
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

export default PostpartumCheckupForm;
