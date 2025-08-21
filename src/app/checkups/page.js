"use client";
import { useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function CheckupScheduling() {
  const { token, user } = useAppContext();
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
      const res = await fetch("http://localhost:8080/api/pregnancy-checkups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, ...data }),
      });
      if (res.ok) {
        setSuccess("Checkup scheduled successfully");
        setError("");
        reset();
      } else {
        const result = await res.json();
        setError(result.message || "Failed to schedule checkup");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Checkup Scheduling</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Date</label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300">Details</label>
              <input
                type="text"
                {...register("details", { required: "Details are required" })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.details && (
                <p className="text-red-500 text-sm">{errors.details.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register("weight")}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">
                Blood Pressure (e.g., 120/80)
              </label>
              <input
                type="text"
                {...register("bloodPressure")}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">
                Fetal Movement (e.g., Yes/No)
              </label>
              <input
                type="text"
                {...register("fetalMovement")}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg"
            >
              Schedule Checkup
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
