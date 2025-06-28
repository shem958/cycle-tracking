"use client";
import { useState } from "react";
import { Calendar, Activity, Heart, Clock } from "lucide-react";

const CycleForm = () => {
  const [cycleData, setCycleData] = useState({
    startDate: "",
    length: "",
    symptoms: "",
    mood: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCycleData({ ...cycleData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/cycles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cycleData),
      });

      if (response.ok) {
        const savedEntry = await response.json();
        console.log("Cycle entry saved:", savedEntry);
        setCycleData({ startDate: "", length: "", symptoms: "", mood: "" });
      } else {
        console.error("Failed to save cycle entry");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-pink-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-gray-700 dark:text-gray-200 text-xl">
          Track your cycles accurately, including irregular patterns, and gain
          valuable health insights.
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#1B2433] shadow-xl"
      >
        <h2 className="text-3xl font-semibold mb-8 text-white text-center">
          Cycle Journal
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={cycleData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#2A3441] border-none text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                <Clock className="w-4 h-4" />
                Cycle Length (Days)
              </label>
              <input
                type="number"
                name="length"
                value={cycleData.length}
                onChange={handleChange}
                required
                min="1"
                max="99"
                className="w-full px-4 py-3 rounded-xl bg-[#2A3441] border-none text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                <Heart className="w-4 h-4" />
                Mood
              </label>
              <input
                type="text"
                name="mood"
                value={cycleData.mood}
                onChange={handleChange}
                placeholder="How are you feeling?"
                className="w-full px-4 py-3 rounded-xl bg-[#2A3441] border-none text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
              <Activity className="w-4 h-4" />
              Symptoms & Notes
            </label>
            <textarea
              name="symptoms"
              value={cycleData.symptoms}
              onChange={handleChange}
              rows="12"
              placeholder="Describe any symptoms, feelings, or notes about your cycle..."
              className="w-full h-[calc(100%-2rem)] px-4 py-3 rounded-xl bg-[#2A3441] border-none text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg transform transition-all duration-200 hover:scale-[1.02] focus:ring-4 focus:ring-pink-500/50 min-w-[160px]"
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default CycleForm;
