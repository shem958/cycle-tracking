"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAppContext } from "../context/AppContext";

const HealthInsights = () => {
  const { cycles, token } = useAppContext();
  const [insights, setInsights] = useState({
    totalCycles: 0,
    averageLength: 0,
    nextPeriod: null,
    fertileWindow: [],
    irregularity: 0,
  });

  useEffect(() => {
    const fetchInsights = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8080/api/insights/cycle", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setInsights({
            totalCycles: cycles.length,
            averageLength: data.averageCycleLength || 0,
            nextPeriod: data.nextPeriodPrediction || null,
            fertileWindow: data.fertileWindow || [],
            irregularity: data.irregularityIndex || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch insights:", err);
      }
    };
    fetchInsights();
  }, [token, cycles]);

  const chartData = cycles.map((cycle) => ({
    date: cycle.startDate,
    length: cycle.length,
  }));

  return (
    <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Health Insights
      </h2>
      <div className="space-y-4">
        <div className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md bg-light-bg/50 dark:bg-dark-bg/50">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Cycle Summary
          </h3>
          <p className="text-foreground mb-3">
            <strong>Total Cycles Logged:</strong>{" "}
            <span>{insights.totalCycles}</span>
          </p>
          <p className="text-foreground">
            <strong>Average Cycle Length:</strong>{" "}
            <span>{insights.averageLength.toFixed(2)} days</span>
          </p>
          <p className="text-foreground">
            <strong>Next Period Prediction:</strong>{" "}
            <span>{insights.nextPeriod || "N/A"}</span>
          </p>
          <p className="text-foreground">
            <strong>Fertile Window:</strong>{" "}
            <span>{insights.fertileWindow.join(" to ") || "N/A"}</span>
          </p>
          <p className="text-foreground">
            <strong>Irregularity Index:</strong>{" "}
            <span>{insights.irregularity.toFixed(2)}</span>
          </p>
        </div>
        <div className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md bg-light-bg/50 dark:bg-dark-bg/50">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Cycle Length Trend
          </h3>
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="length" fill="#f472b6" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;
