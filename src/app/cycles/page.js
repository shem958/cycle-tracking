"use client";
import CycleForm from "@/app/components/CycleForm";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAppContext } from "@/app/context/AppContext";
import { useEffect } from "react";

export default function CyclesPage() {
  const { fetchCycles, token } = useAppContext();

  // Ensure cycles are loaded when page mounts
  useEffect(() => {
    if (token) {
      fetchCycles();
    }
  }, [token, fetchCycles]);

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="min-h-screen">
        <CycleForm />
      </div>
    </ProtectedRoute>
  );
}
