import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import PregnancyForm from "./PregnancyForm";
import CheckupForm from "./CheckupForm";
import SymptomLogger from "./SymptomLogger";
import PregnancyInsights from "./PregnancyInsights";

const PregnancyDashboard = () => {
  const { user, token } = useContext(AppContext);
  const [pregnancyData, setPregnancyData] = useState(null);
  const [checkups, setCheckups] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id && token) {
      fetchPregnancyData();
      fetchCheckups();
    }
  }, [user?.id, token]);

  const fetchPregnancyData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/pregnancy/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPregnancyData(data);
      }
    } catch (err) {
      setError("Failed to fetch pregnancy data");
    }
  };

  const fetchCheckups = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/pregnancy-checkups/user/${user.id}`,
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

  const calculateWeeksPregnant = () => {
    if (!pregnancyData?.start_date) return 0;
    const startDate = new Date(pregnancyData.start_date);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };

  const calculateDaysUntilDue = () => {
    if (!pregnancyData?.due_date) return null;
    const dueDate = new Date(pregnancyData.due_date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Pregnancy Journey
        </h1>
        {pregnancyData && (
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Current Week</h3>
                <p className="text-2xl font-bold">{calculateWeeksPregnant()}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Days Until Due</h3>
                <p className="text-2xl font-bold">
                  {calculateDaysUntilDue() || "N/A"}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Trimester</h3>
                <p className="text-2xl font-bold">
                  {calculateWeeksPregnant() <= 12
                    ? "1st"
                    : calculateWeeksPregnant() <= 26
                    ? "2nd"
                    : "3rd"}
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
              { id: "symptoms", name: "Symptoms", icon: "📝" },
              { id: "insights", name: "Insights", icon: "💡" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-pink-500 text-pink-600"
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
              {!pregnancyData ? (
                <PregnancyForm onSave={fetchPregnancyData} />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">
                        Pregnancy Details
                      </h3>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(
                          pregnancyData.start_date
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Due Date:</strong>{" "}
                        {new Date(pregnancyData.due_date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Current Week:</strong>{" "}
                        {pregnancyData.current_week}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Recent Checkups
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {checkups.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total checkups recorded
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "checkups" && (
            <div>
              <div className="mb-6">
                <CheckupForm onSave={fetchCheckups} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Previous Checkups</h3>
                {checkups.map((checkup) => (
                  <div
                    key={checkup.id}
                    className="bg-gray-50 p-4 rounded-lg border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">Week {checkup.week}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(checkup.checkup_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <strong>Weight:</strong> {checkup.weight} kg
                      </p>
                      <p>
                        <strong>BP:</strong> {checkup.blood_pressure}
                      </p>
                    </div>
                    {checkup.doctor_notes && (
                      <p className="mt-2 text-sm">
                        <strong>Notes:</strong> {checkup.doctor_notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "symptoms" && (
            <SymptomLogger pregnancyId={pregnancyData?.id} />
          )}

          {activeTab === "insights" && <PregnancyInsights userId={user?.id} />}
        </div>
      </div>
    </div>
  );
};

export default PregnancyDashboard;
