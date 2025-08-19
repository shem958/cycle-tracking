"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { EnhancedCyclePredictor } from "../utils/cyclePredictor";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const OvulationTracker = () => {
  const { cycles, token } = useAppContext();
  const [insights, setInsights] = useState({
    ovulationDate: null,
    fertileWindow: { start: "-", end: "-" },
  });

  // Client-side prediction fallback
  const latestCycle = useMemo(() => {
    if (!cycles || cycles.length === 0) return null;
    return cycles[cycles.length - 1];
  }, [cycles]);

  const calculateOvulationDate = () => {
    if (!latestCycle) return "-";
    const ovulationDate = new Date(latestCycle.startDate);
    ovulationDate.setDate(ovulationDate.getDate() + (latestCycle.length - 14));
    return ovulationDate.toLocaleDateString();
  };

  const calculateFertileWindow = () => {
    if (!latestCycle) return { start: "-", end: "-" };
    const ovulationDate = new Date(latestCycle.startDate);
    ovulationDate.setDate(ovulationDate.getDate() + (latestCycle.length - 14));

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    return {
      start: fertileStart.toLocaleDateString(),
      end: fertileEnd.toLocaleDateString(),
    };
  };

  // Fetch backend insights
  useEffect(() => {
    const fetchInsights = async () => {
      if (!token || !navigator.onLine) {
        // Fallback to client-side prediction if offline
        const predictor = new EnhancedCyclePredictor(cycles);
        const prediction = predictor.predictNextCycle();
        if (prediction) {
          setInsights({
            ovulationDate: prediction.predictedStartDate
              ? new Date(
                  new Date(prediction.predictedStartDate).getTime() -
                    14 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()
              : "-",
            fertileWindow: {
              start: prediction.fertileWindow?.[0]
                ? new Date(prediction.fertileWindow[0]).toLocaleDateString()
                : "-",
              end: prediction.fertileWindow?.[1]
                ? new Date(prediction.fertileWindow[1]).toLocaleDateString()
                : "-",
            },
          });
        }
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/insights/cycle", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setInsights({
            ovulationDate: data.nextPeriodPrediction
              ? new Date(
                  new Date(data.nextPeriodPrediction).getTime() -
                    14 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()
              : calculateOvulationDate(),
            fertileWindow: data.fertileWindow?.length
              ? {
                  start: new Date(data.fertileWindow[0]).toLocaleDateString(),
                  end: new Date(data.fertileWindow[1]).toLocaleDateString(),
                }
              : calculateFertileWindow(),
          });
        } else {
          setInsights({
            ovulationDate: calculateOvulationDate(),
            fertileWindow: calculateFertileWindow(),
          });
        }
      } catch (err) {
        console.error("Failed to fetch insights:", err);
        setInsights({
          ovulationDate: calculateOvulationDate(),
          fertileWindow: calculateFertileWindow(),
        });
      }
    };
    fetchInsights();
  }, [token, cycles]);

  // Calendar tile content
  const tileContent = ({ date }) => {
    if (!insights.fertileWindow.start || !insights.fertileWindow.end)
      return null;
    const start = new Date(insights.fertileWindow.start);
    const end = new Date(insights.fertileWindow.end);
    const ovulation = new Date(insights.ovulationDate);
    if (
      date.toDateString() >= start.toDateString() &&
      date.toDateString() <= end.toDateString()
    ) {
      return <p className="text-pink-300 font-bold">●</p>;
    }
    if (date.toDateString() === ovulation.toDateString()) {
      return <p className="text-pink-500 font-bold">★</p>;
    }
    return null;
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Ovulation Tracker
      </h2>

      {!latestCycle ? (
        <p className="text-foreground/80">
          No cycle data available. Please log a cycle to see ovulation
          predictions.
        </p>
      ) : (
        <div className="space-y-6">
          <div
            className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                      bg-light-bg/50 dark:bg-dark-bg/50 
                      transition-colors duration-300 ease"
          >
            <h3 className="text-lg font-medium text-foreground mb-3">
              Estimated Ovulation Date
            </h3>
            <p className="text-foreground text-lg font-semibold">
              {insights.ovulationDate}
            </p>
          </div>

          <div
            className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                      bg-light-bg/50 dark:bg-dark-bg/50 
                      transition-colors duration-300 ease"
          >
            <h3 className="text-lg font-medium text-foreground mb-3">
              Fertile Window
            </h3>
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="font-medium">Start:</span>{" "}
                <span className="text-foreground/90">
                  {insights.fertileWindow.start}
                </span>
              </p>
              <p className="text-foreground">
                <span className="font-medium">End:</span>{" "}
                <span className="text-foreground/90">
                  {insights.fertileWindow.end}
                </span>
              </p>
            </div>
          </div>

          <div
            className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                      bg-light-bg/50 dark:bg-dark-bg/50 
                      transition-colors duration-300 ease"
          >
            <h3 className="text-lg font-medium text-foreground mb-3">
              Fertile Window Calendar
            </h3>
            <Calendar
              tileContent={tileContent}
              className="border-none bg-transparent"
            />
          </div>

          <div
            className="mt-4 p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                      bg-light-bg/30 dark:bg-dark-bg/30 
                      text-foreground/80 text-sm
                      transition-colors duration-300 ease"
          >
            <p>
              Note: These dates are estimates based on your logged cycles. Your
              actual fertile window may vary. Consider tracking additional
              fertility signs for more accuracy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OvulationTracker;
