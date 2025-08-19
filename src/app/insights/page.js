"use client";
import { useEffect } from "react";
import HealthInsights from "@/app/components/HealthInsights";
import Calendar from "react-calendar";
import { useAppContext } from "@/app/context/AppContext";
import "react-calendar/dist/Calendar.css";

export default function HealthInsightsPage() {
  const { cycles, fetchCycles } = useAppContext();

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  const tileContent = ({ date }) => {
    const cycle = cycles.find(
      (c) => new Date(c.startDate).toDateString() === date.toDateString()
    );
    return cycle ? <p className="text-pink-500 font-bold">●</p> : null;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Health Insights</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <HealthInsights />
        <div className="bg-background p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Cycle Calendar
          </h2>
          <Calendar
            tileContent={tileContent}
            className="border-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
