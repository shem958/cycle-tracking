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
  ResponsiveContainer,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!token) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:8080/api/insights/cycle", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${res.status}: Failed to fetch insights`
          );
        }

        const data = await res.json();

        setInsights({
          totalCycles: cycles.length,
          averageLength: data.averageCycleLength || 0,
          nextPeriod: data.nextPeriodPrediction || null,
          fertileWindow: data.fertileWindow || [],
          irregularity: data.irregularityIndex || 0,
        });
      } catch (err) {
        console.error("Failed to fetch insights:", err);
        setError(err.message || "Failed to load insights data");

        // Fallback to basic calculations from cycles data
        if (cycles.length > 0) {
          const avgLength =
            cycles.reduce((sum, cycle) => sum + cycle.length, 0) /
            cycles.length;
          setInsights({
            totalCycles: cycles.length,
            averageLength: avgLength,
            nextPeriod: null,
            fertileWindow: [],
            irregularity: 0,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [token, cycles]);

  // Prepare chart data
  const chartData = cycles.map((cycle, index) => ({
    cycle: `Cycle ${index + 1}`,
    date: new Date(cycle.startDate).toLocaleDateString(),
    length: cycle.length,
  }));

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
        <h2 className="text-xl font-semibold mb-6 text-foreground">
          Health Insights
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
        <h2 className="text-xl font-semibold mb-6 text-foreground">
          Health Insights
        </h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          <p className="text-red-600 dark:text-red-400 text-xs mt-2">
            Showing basic calculations from your cycle data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Health Insights
      </h2>

      {cycles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-foreground/80 text-lg mb-2">
            No data to analyze yet
          </p>
          <p className="text-foreground/60 text-sm">
            Track at least 2 cycles to see detailed health insights and
            predictions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cycle Summary */}
          <div className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-lg bg-light-bg/50 dark:bg-dark-bg/50">
            <h3 className="text-lg font-medium text-foreground mb-3">
              Cycle Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-foreground">
                  <strong>Total Cycles Logged:</strong>{" "}
                  <span className="text-pink-500 font-bold">
                    {insights.totalCycles}
                  </span>
                </p>
                <p className="text-foreground mt-2">
                  <strong>Average Cycle Length:</strong>{" "}
                  <span className="text-pink-500 font-bold">
                    {insights.averageLength.toFixed(1)} days
                  </span>
                </p>
              </div>
              <div>
                <p className="text-foreground">
                  <strong>Next Period Prediction:</strong>{" "}
                  <span className="text-blue-500 font-bold">
                    {insights.nextPeriod || "Calculating..."}
                  </span>
                </p>
                <p className="text-foreground mt-2">
                  <strong>Irregularity Index:</strong>{" "}
                  <span
                    className={`font-bold ${
                      insights.irregularity < 0.3
                        ? "text-green-500"
                        : insights.irregularity < 0.6
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {insights.irregularity.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {insights.fertileWindow.length > 0 && (
              <p className="text-foreground mt-3">
                <strong>Fertile Window:</strong>{" "}
                <span className="text-purple-500 font-bold">
                  {insights.fertileWindow.join(" to ")}
                </span>
              </p>
            )}
          </div>

          {/* Cycle Length Trend Chart */}
          <div className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-lg bg-light-bg/50 dark:bg-dark-bg/50">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Cycle Length Trend
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="cycle" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="length"
                    fill="#EC4899"
                    name="Cycle Length (days)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-foreground/60">No chart data available</p>
              </div>
            )}
          </div>

          {/* Health Tips */}
          <div className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
            <h3 className="text-lg font-medium text-foreground mb-3">
              💡 Health Tips
            </h3>
            <div className="space-y-2 text-sm">
              {insights.averageLength < 21 && (
                <p className="text-orange-700 dark:text-orange-300">
                  Your cycles are shorter than average. Consider consulting a
                  healthcare provider.
                </p>
              )}
              {insights.averageLength > 35 && (
                <p className="text-orange-700 dark:text-orange-300">
                  Your cycles are longer than average. Consider consulting a
                  healthcare provider.
                </p>
              )}
              {insights.irregularity > 0.5 && (
                <p className="text-red-700 dark:text-red-300">
                  Your cycles show high irregularity. Track stress, diet, and
                  exercise patterns.
                </p>
              )}
              {insights.irregularity <= 0.3 && insights.totalCycles > 3 && (
                <p className="text-green-700 dark:text-green-300">
                  Great! Your cycles are quite regular. Keep up your healthy
                  habits.
                </p>
              )}
              <p className="text-gray-700 dark:text-gray-300">
                Regular tracking helps identify patterns and potential health
                concerns early.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthInsights;
