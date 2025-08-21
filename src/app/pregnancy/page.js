"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function PregnancyDashboard() {
  const { token, user } = useAppContext();
  const [pregnancyData, setPregnancyData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPregnancyData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/pregnancy-checkups/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          // Aggregate data into the expected format
          const checkups = data || [];
          const latestCheckup =
            checkups.length > 0 ? checkups[checkups.length - 1] : null;
          setPregnancyData({
            estimatedDueDate: latestCheckup?.date
              ? new Date(latestCheckup.date).setDate(
                  new Date(latestCheckup.date).getDate() + 40 * 7
                )
              : null, // Rough estimate
            appointments: checkups,
            weight: latestCheckup?.weight || null,
            bloodPressure: latestCheckup?.bloodPressure || null,
          });
        } else {
          setError("No pregnancy data available");
        }
      } catch {
        setError("Something went wrong");
      }
    };
    if (token && user?.id) fetchPregnancyData();
  }, [token, user?.id]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!pregnancyData) return <div className="p-6 text-center">Loading...</div>;

  const { estimatedDueDate, appointments, weight, bloodPressure } =
    pregnancyData;

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Pregnancy Dashboard</h1>
        <div className="bg-background p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2 text-foreground">
              Overview
            </h2>
            <p className="text-foreground">
              <strong>Estimated Due Date:</strong>{" "}
              {estimatedDueDate
                ? new Date(estimatedDueDate).toLocaleDateString()
                : "Not estimated"}
            </p>
            <p className="text-foreground">
              <strong>Current Week:</strong>{" "}
              {estimatedDueDate
                ? Math.floor(
                    (((new Date() - new Date(estimatedDueDate)) /
                      (7 * 24 * 60 * 60 * 1000)) *
                      -1) /
                      7
                  ) + " weeks"
                : "N/A"}
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2 text-foreground">
              Health Metrics
            </h2>
            <p className="text-foreground">
              <strong>Weight:</strong> {weight || "Not recorded"} kg
            </p>
            <p className="text-foreground">
              <strong>Blood Pressure:</strong> {bloodPressure || "Not recorded"}{" "}
              mmHg
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2 text-foreground">
              Appointments
            </h2>
            <ul className="space-y-2">
              {appointments?.length > 0 ? (
                appointments.map((appt, index) => (
                  <li key={index} className="text-foreground">
                    {new Date(appt.date).toLocaleString()} - {appt.details}
                  </li>
                ))
              ) : (
                <p className="text-foreground/80">No appointments scheduled.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
