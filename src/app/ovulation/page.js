"use client";
import { useEffect } from "react";
import OvulationTracker from "@/app/components/OvulationTracker";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAppContext } from "@/app/context/AppContext";

export default function OvulationTrackerPage() {
  const { cycles, fetchCycles } = useAppContext();

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Ovulation Tracker</h1>
        <OvulationTracker cycles={cycles} />
      </div>
    </ProtectedRoute>
  );
}
