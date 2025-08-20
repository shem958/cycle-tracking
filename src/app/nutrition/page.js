"use client";
import { useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useForm } from "react-hook-form";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function NutritionTracker() {
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
      const res = await fetch("http://localhost:8080/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess("Nutrition logged successfully");
        setError("");
        reset();
      } else {
        setError("Failed to log nutrition");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Nutrition Tracker</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Food Item</label>
              <input
                type="text"
                {...register("foodItem", { required: "Food item is required" })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.foodItem && (
                <p className="text-red-500 text-sm">
                  {errors.foodItem.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300">Calories</label>
              <input
                type="number"
                {...register("calories", {
                  required: "Calories are required",
                  min: 0,
                })}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
              {errors.calories && (
                <p className="text-red-500 text-sm">
                  {errors.calories.message}
                </p>
              )}
            </div>
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg"
            >
              Log Nutrition
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
