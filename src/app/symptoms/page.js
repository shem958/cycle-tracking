"use client";
import { useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function SymptomTracking() {
  const { token } = useAppContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8080/api/symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess("Symptoms logged successfully");
        setError("");
        reset();
      } else {
        setError("Failed to log symptoms");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Symptom Tracking</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Symptoms</label>
              <input
                type="text"
                {...register("symptoms", { required: "Symptoms are required" })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.symptoms && (
                <p className="text-red-500 text-sm">
                  {errors.symptoms.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register("weight", {
                  required: "Weight is required",
                  min: 0,
                })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm">{errors.weight.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300">
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                {...register("bloodPressure", {
                  required: "Blood pressure is required",
                })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
                placeholder="e.g., 120/80"
              />
              {errors.bloodPressure && (
                <p className="text-red-500 text-sm">
                  {errors.bloodPressure.message}
                </p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg"
            >
              Log Symptoms
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
