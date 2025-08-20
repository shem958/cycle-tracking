import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const COMMON_SYMPTOMS = [
  "Nausea",
  "Fatigue",
  "Breast tenderness",
  "Food cravings",
  "Food aversions",
  "Headaches",
  "Dizziness",
  "Heartburn",
  "Constipation",
  "Back pain",
  "Leg cramps",
  "Sleep issues",
  "Mood swings",
  "Frequent urination",
];

const SEVERITY_LEVELS = [
  { value: 1, label: "Mild", color: "text-green-600" },
  { value: 2, label: "Moderate", color: "text-yellow-600" },
  { value: 3, label: "Severe", color: "text-red-600" },
];

const SymptomLogger = ({ pregnancyId }) => {
  const { token } = useContext(AppContext);
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) => {
      if (prev[symptom]) {
        const newSymptoms = { ...prev };
        delete newSymptoms[symptom];
        return newSymptoms;
      } else {
        return { ...prev, [symptom]: 1 };
      }
    });
  };

  const handleSeverityChange = (symptom, severity) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptom]: severity,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(selectedSymptoms).length === 0) {
      setError("Please select at least one symptom");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const symptomData = {
        pregnancy_id: pregnancyId,
        symptoms: selectedSymptoms,
        notes: notes,
        logged_at: new Date().toISOString(),
      };

      const response = await fetch(
        "http://localhost:8080/api/pregnancy-symptoms",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(symptomData),
        }
      );

      if (response.ok) {
        setSuccess("Symptoms logged successfully!");
        setSelectedSymptoms({});
        setNotes("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to log symptoms");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Log Your Symptoms</h3>
        <p className="text-gray-600 mb-6">
          Track how you're feeling today. Select symptoms and rate their
          severity.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Symptoms
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => (
              <div
                key={symptom}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedSymptoms[symptom]
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleSymptomToggle(symptom)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{symptom}</span>
                  {selectedSymptoms[symptom] && (
                    <span className="text-pink-500">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(selectedSymptoms).length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate Severity
            </label>
            <div className="space-y-3">
              {Object.keys(selectedSymptoms).map((symptom) => (
                <div
                  key={symptom}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{symptom}</span>
                  <div className="flex space-x-2">
                    {SEVERITY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          handleSeverityChange(symptom, level.value)
                        }
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedSymptoms[symptom] === level.value
                            ? "bg-pink-500 text-white"
                            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Any additional details about how you're feeling..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || Object.keys(selectedSymptoms).length === 0}
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging Symptoms..." : "Log Symptoms"}
        </button>
      </form>
    </div>
  );
};

export default SymptomLogger;
