"use client";
import { useEffect, useState } from "react";
import { Calendar, Activity, Heart, Clock, Trash2, Pencil } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useForm } from "react-hook-form";
import { openDB } from "idb";

const CycleForm = () => {
  const { cycles, setCycles, fetchCycles } = useAppContext();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Predefined options
  const moodOptions = ["Happy", "Sad", "Anxious", "Irritable", "Calm"];
  const symptomOptions = [
    "Cramps",
    "Fatigue",
    "Headache",
    "Bloating",
    "Nausea",
  ];

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("CycleTrackerDB", 1, {
        upgrade(db) {
          db.createObjectStore("pendingCycles", { keyPath: "id" });
        },
      });
      // Sync pending cycles when online
      if (navigator.onLine) {
        syncPendingCycles(db);
      }
    };
    initDB();
  }, []);

  const syncPendingCycles = async (db) => {
    const tx = db.transaction("pendingCycles", "readwrite");
    const store = tx.objectStore("pendingCycles");
    const pending = await store.getAll();
    for (const cycle of pending) {
      await submitCycle(cycle, cycle.id ? "PUT" : "POST", cycle.id);
      await store.delete(cycle.id);
    }
  };

  const handleSubmit = async (data) => {
    const cycleData = {
      startDate: data.startDate,
      length: parseInt(data.length),
      symptoms: data.symptoms.join(","), // Convert array to comma-separated string
      mood: data.mood,
    };
    const tempId = isEditing ? editId : Date.now();

    if (!navigator.onLine) {
      // Save to IndexedDB if offline
      const db = await openDB("CycleTrackerDB", 1);
      await db.put("pendingCycles", { ...cycleData, id: tempId });
      setCycles([...cycles, { ...cycleData, ID: tempId }]);
      resetForm();
      return;
    }

    await submitCycle(cycleData, isEditing ? "PUT" : "POST", editId);
  };

  const submitCycle = async (cycleData, method, id) => {
    try {
      const token = localStorage.getItem("token");
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

      if (res.ok) {
        resetForm();
        fetchCycles();
      } else {
        throw new Error("Failed to save cycle");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleEdit = (cycle) => {
    setValue("startDate", cycle.startDate);
    setValue("length", cycle.length);
    setValue("symptoms", cycle.symptoms ? cycle.symptoms.split(",") : []);
    setValue("mood", cycle.mood);
    setEditId(cycle.ID);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/cycles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchCycles();
      } else {
        console.error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const resetForm = () => {
    reset({ startDate: "", length: "", symptoms: [], mood: "" });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="min-h-screen w-full bg-pink-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-gray-700 dark:text-gray-200 text-xl">
          Track your cycles accurately and gain valuable health insights.
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSubmit)}
        className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#1B2433] shadow-xl"
      >
        <h2 className="text-3xl font-semibold mb-8 text-white text-center">
          {isEditing ? "Edit Cycle" : "Cycle Journal"}
        </h2>

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
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">
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
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.length && (
                <p className="text-red-500 text-sm">{errors.length.message}</p>
              )}
            </label>

            <label className="block text-sm text-gray-300">
              <Heart className="inline w-4 h-4 mr-2" />
              Mood
              <select
                {...register("mood")}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
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
            <div className="mt-2 space-y-2">
              {symptomOptions.map((symptom) => (
                <label key={symptom} className="flex items-center">
                  <input
                    type="checkbox"
                    value={symptom}
                    {...register("symptoms")}
                    className="mr-2"
                  />
                  {symptom}
                </label>
              ))}
            </div>
            {errors.symptoms && (
              <p className="text-red-500 text-sm">{errors.symptoms.message}</p>
            )}
          </label>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg"
          >
            {isEditing ? "Update Entry" : "Save Entry"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-300 hover:text-white underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="max-w-4xl mx-auto mt-12">
        <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">
          Past Entries
        </h3>
        <ul className="space-y-4">
          {cycles.map((entry) => (
            <li
              key={entry.ID}
              className="bg-white dark:bg-[#2A3441] rounded-xl p-4 shadow flex justify-between items-center"
            >
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {entry.startDate} - {entry.length} days
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mood: {entry.mood} | Symptoms: {entry.symptoms}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.ID)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CycleForm;
