import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import PostpartumForm from "./PostpartumForm";
import PostpartumCheckupForm from "./PostpartumCheckupForm";
import PostpartumInsights from "./PostpartumInsights";

const PostpartumDashboard = () => {
  const { user, token } = useContext(AppContext);
  const [postpartumData, setPostpartumData] = useState(null);
  const [checkups, setCheckups] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id && token) {
      fetchPostpartumData();
      fetchCheckups();
    }
  }, [user?.id, token]);

  const fetchPostpartumData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/postpartum/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPostpartumData(data);
      }
    } catch (err) {
      setError("Failed to fetch postpartum data");
    }
  };

  const fetchCheckups = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/postpartum-checkups/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCheckups(data || []);
      }
    } catch (err) {
      setError("Failed to fetch checkups");
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysPostpartum = () => {
    if (!postpartumData?.delivery_date) return 0;
    const deliveryDate = new Date(postpartumData.delivery_date);
    const today = new Date();
    const diffTime = Math.abs(today - deliveryDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateWeeksPostpartum = () => {
    return Math.floor(calculateDaysPostpartum() / 7);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Postpartum Recovery
        </h1>
        {postpartumData && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Days Postpartum</h3>
                <p className="text-2xl font-bold">
                  {calculateDaysPostpartum()}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Weeks Postpartum</h3>
                <p className="text-2xl font-bold">
                  {calculateWeeksPostpartum()}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Recovery Phase</h3>
                <p className="text-2xl font-bold">
                  {calculateWeeksPostpartum() <= 6
                    ? "Early"
                    : calculateWeeksPostpartum() <= 12
                    ? "Extended"
                    : "Long-term"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "overview", name: "Overview", icon: "📊" },
              { id: "checkups", name: "Checkups", icon: "🏥" },
              { id: "wellness", name: "Daily Wellness", icon: "💆‍♀️" },
              { id: "insights", name: "Insights", icon: "💡" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div>
              {!postpartumData ? (
                <PostpartumForm onSave={fetchPostpartumData} />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">
                        Recovery Details
                      </h3>
                      <p>
                        <strong>Delivery Date:</strong>{" "}
                        {new Date(
                          postpartumData.delivery_date
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Delivery Type:</strong>{" "}
                        {postpartumData.delivery_type}
                      </p>
                      <p>
                        <strong>Days Postpartum:</strong>{" "}
                        {calculateDaysPostpartum()}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Recovery Tracking
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {checkups.length}
                      </p>
                      <p className="text-sm text-gray-600">Checkups recorded</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "checkups" && (
            <div>
              <div className="mb-6">
                <PostpartumCheckupForm onSave={fetchCheckups} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recovery Checkups</h3>
                {checkups.map((checkup) => (
                  <div
                    key={checkup.id}
                    className="bg-gray-50 p-4 rounded-lg border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">
                        Week {Math.floor(checkup.days_postpartum / 7)}{" "}
                        Postpartum
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(checkup.checkup_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <strong>Days:</strong> {checkup.days_postpartum}
                      </p>
                      <p>
                        <strong>Mood:</strong> {checkup.mood_rating}/10
                      </p>
                    </div>
                    {checkup.notes && (
                      <p className="mt-2 text-sm">
                        <strong>Notes:</strong> {checkup.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wellness" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Daily Wellness Tracking
              </h3>
              <p className="text-gray-600 mb-6">
                Track your daily recovery progress, mood, and well-being.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">
                  Daily wellness tracking form coming soon...
                </p>
              </div>
            </div>
          )}

          {activeTab === "insights" && <PostpartumInsights userId={user?.id} />}
        </div>
      </div>
    </div>
  );
};

export default PostpartumDashboard;
