"use client";
import { useEffect, useState, useCallback } from "react";
import { Calendar, Activity, Heart, Clock, Trash2, Pencil } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useForm } from "react-hook-form";

const CycleForm = () => {
  const { cycles, setCycles, fetchCycles, token } = useAppContext();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Predefined options
  const moodOptions = ["Happy", "Sad", "Anxious", "Irritable", "Calm"];
  const symptomOptions = [
    "Cramps",
    "Fatigue",
    "Headache",
    "Bloating",
    "Nausea",
  ];

  const resetForm = useCallback(() => {
    reset({ startDate: "", length: "", symptoms: [], mood: "" });
    setIsEditing(false);
    setEditId(null);
    setError("");
    setSuccess("");
  }, [reset]);

  const submitCycle = useCallback(
    async (cycleData, method, id) => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const url = id
          ? `http://localhost:8080/api/cycles/${id}`
          : "http://localhost:8080/api/cycles";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cycleData),
        });

        if (!res.ok) {
          const result = await res.json().catch(() => ({}));
          throw new Error(
            result.message || `HTTP ${res.status}: Failed to save cycle`
          );
        }

        resetForm();
        await fetchCycles(); // Ensure cycles are refreshed
        setSuccess("Cycle saved successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Submit error:", err);
        setError(err.message || "Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [fetchCycles, resetForm, token]
  );

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    // Validate data
    if (!data.startDate) {
      setError("Start date is required");
      return;
    }

    if (!data.length || data.length < 1 || data.length > 99) {
      setError("Cycle length must be between 1 and 99 days");
      return;
    }

    const cycleData = {
      startDate: data.startDate,
      length: parseInt(data.length),
      symptoms: Array.isArray(data.symptoms) ? data.symptoms.join(",") : "",
      mood: data.mood || "",
    };

    await submitCycle(cycleData, isEditing ? "PUT" : "POST", editId);
  };

  const handleEdit = (cycle) => {
    if (!cycle) return;

    setValue("startDate", cycle.startDate);
    setValue("length", cycle.length);
    setValue("symptoms", cycle.symptoms ? cycle.symptoms.split(",") : []);
    setValue("mood", cycle.mood || "");
    setEditId(cycle.ID);
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setLoading(true);
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`http://localhost:8080/api/cycles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.message || "Failed to delete entry");
      }

      await fetchCycles();
      setSuccess("Entry deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete entry");
    } finally {
      setLoading(false);
    }
  };

  // Auto-clear error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-pink-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-gray-700 dark:text-gray-200 text-xl">
          Track your cycles accurately and gain valuable health insights.
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#1B2433] shadow-xl"
      >
        <h2 className="text-3xl font-semibold mb-8 text-white text-center">
          {isEditing ? "Edit Cycle" : "Cycle Journal"}
        </h2>

        {/* Feedback messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
            <p className="text-green-800 dark:text-green-200 text-sm">
              {success}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <label className="block text-sm text-gray-300">
              <Calendar className="inline w-4 h-4 mr-2" />
              Start Date
              <input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200 border border-gray-600 focus:border-pink-500 focus:outline-none"
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </label>

            <label className="block text-sm text-gray-300">
              <Clock className="inline w-4 h-4 mr-2" />
              Cycle Length (Days)
              <input
                type="number"
                {...register("length", {
                  required: "Cycle length is required",
                  min: { value: 1, message: "Minimum 1 day" },
                  max: { value: 99, message: "Maximum 99 days" },
                })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200 border border-gray-600 focus:border-pink-500 focus:outline-none"
                min="1"
                max="99"
              />
              {errors.length && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.length.message}
                </p>
              )}
            </label>

            <label className="block text-sm text-gray-300">
              <Heart className="inline w-4 h-4 mr-2" />
              Mood
              <select
                {...register("mood")}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200 border border-gray-600 focus:border-pink-500 focus:outline-none"
              >
                <option value="">Select mood</option>
                {moodOptions.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm text-gray-300">
            <Activity className="inline w-4 h-4 mr-2" />
            Symptoms
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {symptomOptions.map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center text-gray-300 hover:text-white"
                >
                  <input
                    type="checkbox"
                    value={symptom}
                    {...register("symptoms")}
                    className="mr-2 text-pink-500 focus:ring-pink-500"
                  />
                  {symptom}
                </label>
              ))}
            </div>
            {errors.symptoms && (
              <p className="text-red-400 text-sm mt-1">
                {errors.symptoms.message}
              </p>
            )}
          </label>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white font-medium text-lg transition-colors"
            disabled={loading}
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
              ? "Update Entry"
              : "Save Entry"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-300 hover:text-white underline"
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Past Entries Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">
          Past Entries ({cycles.length})
        </h3>

        {cycles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#2A3441] rounded-xl">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400">No entries yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Your cycle entries will appear here after you save them
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {cycles.map((entry) => (
              <li
                key={entry.ID}
                className="bg-white dark:bg-[#2A3441] rounded-xl p-4 shadow flex justify-between items-center hover:shadow-lg transition-shadow"
              >
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {new Date(entry.startDate).toLocaleDateString()} -{" "}
                    {entry.length} days
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Mood:</span>{" "}
                    {entry.mood || "Not specified"} |
                    <span className="font-medium ml-2">Symptoms:</span>{" "}
                    {entry.symptoms || "None"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors"
                    title="Edit"
                    disabled={loading}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.ID)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    title="Delete"
                    disabled={loading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CycleForm;
