"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function PostpartumDashboard() {
  const { token, user } = useAppContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/postpartum/dashboard/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("Something went wrong: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.id) fetchDashboardData();
  }, [token, user?.id]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (loading) return <div className="p-6 text-center">Loading...</div>;

  const { latestMetrics, checkups } = dashboardData || {};

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Postpartum Dashboard</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          {latestMetrics && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2 text-foreground">
                Latest Health Metrics
              </h2>
              <p className="text-foreground">
                <strong>Mood:</strong> {latestMetrics.mood || "Not recorded"}
              </p>
              <p className="text-foreground">
                <strong>Pain Level:</strong>{" "}
                {latestMetrics.pain_level || "Not recorded"}
              </p>
              <p className="text-foreground">
                <strong>Sleep Hours:</strong>{" "}
                {latestMetrics.sleep_hours || "Not recorded"}
              </p>
              <p className="text-foreground">
                <strong>Appetite:</strong>{" "}
                {latestMetrics.appetite_level || "Not recorded"}
              </p>
              {latestMetrics.notes && (
                <p className="text-foreground mt-2">
                  <strong>Notes:</strong> {latestMetrics.notes}
                </p>
              )}
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium mb-2 text-foreground">
              Recent Checkups
            </h2>
            <ul className="space-y-2">
              {checkups?.length > 0 ? (
                checkups.map((checkup) => (
                  <li key={checkup.id} className="text-foreground">
                    {new Date(checkup.visit_date).toLocaleString()}
                    <p className="ml-4 text-sm">
                      {checkup.mother_health_notes}
                    </p>
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
