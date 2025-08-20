"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import CycleHistory from "@/app/components/CycleHistory";

export default function HistoryPage() {
  const { token } = useAppContext();
  const [cycles, setCycles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/cycles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCycles(data);
        } else {
          setError("Failed to fetch cycles");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token) fetchCycles();
  }, [token]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Cycle History</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          {cycles.length > 0 ? (
            <CycleHistory cycles={cycles} />
          ) : (
            <p className="text-foreground/80">No cycles logged yet.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
