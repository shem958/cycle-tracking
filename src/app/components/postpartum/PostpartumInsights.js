import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const PostpartumInsights = ({ userId }) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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

  if (!analytics || !analytics.postpartum_data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No postpartum analytics data available yet.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Start logging recovery checkups to see insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recovery Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Avg Mood</h4>
          <p className="text-2xl font-bold text-purple-600">
            {analytics.postpartum_data && analytics.postpartum_data.length > 0
              ? (
                  analytics.postpartum_data.reduce(
                    (sum, item) => sum + item.mood_rating,
                    0
                  ) / analytics.postpartum_data.length
                ).toFixed(1)
              : "0"}
            /10
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Avg Energy</h4>
          <p className="text-2xl font-bold text-green-600">
            {analytics.postpartum_data && analytics.postpartum_data.length > 0
              ? (
                  analytics.postpartum_data.reduce(
                    (sum, item) => sum + item.energy_level,
                    0
                  ) / analytics.postpartum_data.length
                ).toFixed(1)
              : "0"}
            /10
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Sleep Quality</h4>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.postpartum_data && analytics.postpartum_data.length > 0
              ? (
                  analytics.postpartum_data.reduce(
                    (sum, item) => sum + item.sleep_quality,
                    0
                  ) / analytics.postpartum_data.length
                ).toFixed(1)
              : "0"}
            /10
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Checkups</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {analytics.postpartum_data ? analytics.postpartum_data.length : 0}
          </p>
        </div>
      </div>

      {analytics.postpartum_data && analytics.postpartum_data.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="font-semibold mb-4">Recent Recovery Updates</h4>
          <div className="space-y-3">
            {analytics.postpartum_data
              .slice(-5)
              .reverse()
              .map((checkup, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded"
                >
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">
                      Day {checkup.days_postpartum} Postpartum
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(checkup.checkup_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-purple-600">
                      Mood: {checkup.mood_rating}/10
                    </p>
                    <p className="text-green-600">
                      Energy: {checkup.energy_level}/10
                    </p>
                    <p className="text-blue-600">
                      Sleep: {checkup.sleep_quality}/10
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

export default PostpartumInsights;
