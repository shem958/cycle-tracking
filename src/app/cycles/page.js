"use client";
import CycleForm from "@/app/components/CycleForm";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function CyclesPage() {
  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Cycle Tracking</h1>
        <CycleForm />
      </div>
    </ProtectedRoute>
  );
}
