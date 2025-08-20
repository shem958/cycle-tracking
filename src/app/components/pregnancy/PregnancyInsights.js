import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const PregnancyInsights = ({ userId }) => {
  const { token } = useContext(AppContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId && token) {
      fetchAnalytics();
    }
  }, [userId, token]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/analytics/user/${userId}/pregnancy-postpartum`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/analytics/user/${userId}/pregnancy-postpartum.csv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pregnancy-analytics.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Failed to download CSV:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No analytics data available yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Start logging checkups to see insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pregnancy Insights</h3>
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Total Checkups</h4>
          <p className="text-2xl font-bold text-purple-600">
            {analytics.checkup_timeline?.length || 0}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Weight Gain</h4>
          <p className="text-2xl font-bold text-green-600">
            {analytics.weight_trend && analytics.weight_trend.length > 1
              ? `${(
                  analytics.weight_trend[analytics.weight_trend.length - 1]
                    .weight - analytics.weight_trend[0].weight
                ).toFixed(1)} kg`
              : "0 kg"}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Latest BP</h4>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.blood_pressure_trend &&
            analytics.blood_pressure_trend.length > 0
              ? analytics.blood_pressure_trend[
                  analytics.blood_pressure_trend.length - 1
                ].blood_pressure
              : "N/A"}
          </p>
        </div>
      </div>

      {analytics.checkup_timeline && analytics.checkup_timeline.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="font-semibold mb-4">Checkup Timeline</h4>
          <div className="space-y-3">
            {analytics.checkup_timeline.slice(-5).map((checkup, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
              >
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Week {checkup.week} Checkup</p>
                  <p className="text-sm text-gray-600">
                    {new Date(checkup.checkup_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Weight: {checkup.weight} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    BP: {checkup.blood_pressure}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PregnancyInsights;
