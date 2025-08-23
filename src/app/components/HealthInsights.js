"use client";
import { useEffect, useState } from "react";
import HealthInsights from "@/app/components/HealthInsights";
import Calendar from "react-calendar";
import { useAppContext } from "@/app/context/AppContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import "react-calendar/dist/Calendar.css";

export default function HealthInsightsPage() {
  const { cycles, fetchCycles, token } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (token) {
      fetchCycles();
    }
  }, [fetchCycles, token]);

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const cycle = cycles.find(
      (c) => new Date(c.startDate).toDateString() === date.toDateString()
    );

    if (cycle) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
        </div>
      );
    }

    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const cycle = cycles.find(
      (c) => new Date(c.startDate).toDateString() === date.toDateString()
    );

    if (cycle) {
      return "cycle-date";
    }

    return "";
  };

  return (
    <ProtectedRoute allowedRoles={["user", "doctor", "admin"]}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">
            Health Insights
          </h1>
          <p className="text-foreground/70 mt-1">
            Analyze your cycle patterns and get personalized health insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Health Insights - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <HealthInsights />
          </div>

          {/* Calendar - Takes up 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-background p-6 rounded-lg shadow-md h-full">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Cycle Calendar
              </h2>

              <div className="calendar-container">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                  className="border-none bg-transparent text-foreground"
                />
              </div>

              {/* Legend */}
              <div className="mt-4 p-3 bg-light-bg/50 dark:bg-dark-bg/50 rounded-lg">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Legend
                </h3>
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span>Cycle Start Date</span>
                </div>
              </div>

              {/* Quick Stats */}
              {cycles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="text-foreground/70">Total Cycles:</span>
                    <span className="font-semibold text-foreground ml-2">
                      {cycles.length}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-foreground/70">Last Cycle:</span>
                    <span className="font-semibold text-foreground ml-2">
                      {cycles.length > 0
                        ? new Date(
                            Math.max(
                              ...cycles.map((c) => new Date(c.startDate))
                            )
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="font-medium text-foreground mb-2">
            📊 Understanding Your Data
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/80">
            <div>
              <h4 className="font-medium text-foreground">Cycle Length</h4>
              <p>Normal range is 21-35 days. Track for patterns over time.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">
                Irregularity Index
              </h4>
              <p>
                Lower values indicate more regular cycles. &lt;0.3 is considered
                regular.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .calendar-container .react-calendar {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
        }

        .calendar-container .react-calendar__tile {
          background: transparent;
          border: 1px solid transparent;
          color: inherit;
          position: relative;
        }

        .calendar-container .react-calendar__tile:hover {
          background-color: rgba(236, 72, 153, 0.1);
        }

        .calendar-container .react-calendar__tile--active {
          background-color: rgb(236, 72, 153);
          color: white;
        }

        .calendar-container .react-calendar__tile.cycle-date {
          background-color: rgba(236, 72, 153, 0.2);
          font-weight: bold;
        }

        .calendar-container .react-calendar__navigation button {
          background: transparent;
          color: inherit;
          border: none;
          font-size: 0.875rem;
        }

        .calendar-container .react-calendar__navigation button:hover {
          background-color: rgba(236, 72, 153, 0.1);
        }
      `}</style>
    </ProtectedRoute>
  );
}
