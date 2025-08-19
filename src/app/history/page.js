"use client";
import { useEffect } from "react";
import CycleHistory from "@/app/components/CycleHistory";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAppContext } from "@/app/context/AppContext";

export default function CycleHistoryPage() {
  const { cycles, fetchCycles } = useAppContext();

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Cycle History</h1>
        <CycleHistory cycles={cycles} />
      </div>
    </ProtectedRoute>
  );
}
