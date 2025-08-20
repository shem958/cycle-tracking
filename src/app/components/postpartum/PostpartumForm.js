import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const DELIVERY_TYPES = [
  "Vaginal",
  "C-Section",
  "VBAC",
  "Assisted (Forceps/Vacuum)",
];

const PostpartumForm = ({ onSave }) => {
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    delivery_date: "",
    delivery_type: "",
    complications: "",
    birth_weight: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/postpartum", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          birth_weight: formData.birth_weight
            ? parseFloat(formData.birth_weight)
            : null,
        }),
      });

      if (response.ok) {
        onSave();
        setFormData({
          delivery_date: "",
          delivery_type: "",
          complications: "",
          birth_weight: "",
          notes: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save postpartum data");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Start Your Recovery Journey
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Date
          </label>
          <input
            type="date"
            value={formData.delivery_date}
            onChange={(e) =>
              setFormData({ ...formData, delivery_date: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Type
          </label>
          <select
            value={formData.delivery_type}
            onChange={(e) =>
              setFormData({ ...formData, delivery_type: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select delivery type</option>
            {DELIVERY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birth Weight (kg) - Optional
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.birth_weight}
            onChange={(e) =>
              setFormData({ ...formData, birth_weight: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complications - Optional
          </label>
          <textarea
            value={formData.complications}
            onChange={(e) =>
              setFormData({ ...formData, complications: e.target.value })
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Any complications during delivery..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes - Optional
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Any other information about your delivery..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Start Recovery Tracking"}
        </button>
      </form>
    </div>
  );
};

export default PostpartumForm;
