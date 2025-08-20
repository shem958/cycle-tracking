"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function HealthVisualization() {
  const { token } = useAppContext();
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/health-metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHealthData(data);
        }
      } catch {
        // Handle error silently
      }
    };
    if (token) fetchHealthData();
  }, [token]);

  return (
    <div className="bg-background p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-medium mb-2 text-foreground">
        Health Metrics Visualization
      </h2>
      <BarChart width={600} height={300} data={healthData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="weight" fill="#f472b6" />
        <Bar dataKey="bloodPressure" fill="#a78bfa" />
      </BarChart>
    </div>
  );
}
