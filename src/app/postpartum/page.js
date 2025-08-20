"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function PostpartumDashboard() {
  const { token } = useAppContext();
  const [postpartumData, setPostpartumData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostpartumData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/postpartum", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPostpartumData(data);
        } else {
          setError("No postpartum data available");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token) fetchPostpartumData();
  }, [token]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!postpartumData) return <div className="p-6 text-center">Loading...</div>;

  const { recoveryNotes, checkups, mood, painLevel } = postpartumData;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Postpartum Dashboard</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2 text-foreground">
              Recovery Notes
            </h2>
            <p className="text-foreground">
              {recoveryNotes || "No notes recorded"}
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2 text-foreground">
              Health Metrics
            </h2>
            <p className="text-foreground">
              <strong>Mood:</strong> {mood || "Not recorded"}
            </p>
            <p className="text-foreground">
              <strong>Pain Level:</strong> {painLevel || "Not recorded"}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2 text-foreground">
              Checkups
            </h2>
            <ul className="space-y-2">
              {checkups?.length > 0 ? (
                checkups.map((checkup, index) => (
                  <li key={index} className="text-foreground">
                    {new Date(checkup.date).toLocaleString()} - {checkup.notes}
                  </li>
                ))
              ) : (
                <p className="text-foreground/80">No checkups scheduled.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
