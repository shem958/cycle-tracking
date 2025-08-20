"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function RecommendationsDashboard() {
  const { token } = useAppContext();
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/recommendations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data);
        } else {
          setError("No recommendations available");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token) fetchRecommendations();
  }, [token]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!recommendations.length)
    return <div className="p-6 text-center">Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Health Recommendations</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className="text-foreground p-4 bg-accent/10 rounded-lg"
              >
                <strong>{rec.category}:</strong> {rec.advice}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
