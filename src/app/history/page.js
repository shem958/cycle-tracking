"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import CycleHistory from "@/app/components/CycleHistory";
import { RefreshCw } from "lucide-react";

export default function HistoryPage() {
  const { token, cycles, fetchCycles, loading } = useAppContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCycles = async () => {
      if (!token) return;

      setLocalLoading(true);
      setError("");

      try {
        await fetchCycles();
      } catch (err) {
        console.error("Failed to fetch cycles:", err);
        setError(
          "Failed to load cycle history. Please try refreshing the page."
        );
      } finally {
        setLocalLoading(false);
      }
    };

    loadCycles();
  }, [token, fetchCycles]);

  const handleRefresh = async () => {
    setError("");
    setLocalLoading(true);

    try {
      await fetchCycles();
    } catch (err) {
      console.error("Failed to refresh cycles:", err);
      setError(
        "Failed to refresh data. Please check your connection and try again."
      );
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Cycle History
            </h1>
            <p className="text-foreground/70 mt-1">
              Track your menstrual cycle patterns and predictions
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={localLoading || loading}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                localLoading || loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        <div className="bg-background p-6 rounded-lg shadow-md">
          <CycleHistory
            cycles={cycles}
            loading={localLoading || loading}
            error={error}
          />
        </div>

        {/* Quick Stats */}
        {cycles.length > 0 && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">{cycles.length}</div>
              <div className="text-pink-100 text-sm">Total Cycles Tracked</div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">
                {cycles.length > 0
                  ? Math.round(
                      cycles.reduce((sum, cycle) => sum + cycle.length, 0) /
                        cycles.length
                    )
                  : 0}
              </div>
              <div className="text-purple-100 text-sm">
                Average Cycle Length
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">
                {cycles.length > 0
                  ? new Date(
                      Math.max(...cycles.map((c) => new Date(c.startDate)))
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="text-blue-100 text-sm">Last Cycle</div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <h3 className="font-medium text-foreground mb-2">💡 Tracking Tips</h3>
          <ul className="text-sm text-foreground/80 space-y-1">
            <li>
              • Track consistently for at least 3 cycles for accurate
              predictions
            </li>
            <li>• Note symptoms and mood changes to identify patterns</li>
            <li>• Regular cycles typically range from 21-35 days</li>
            <li>
              • Consult a healthcare provider if you notice significant
              irregularities
            </li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
