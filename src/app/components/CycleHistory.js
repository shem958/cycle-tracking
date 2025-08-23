"use client";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { EnhancedCyclePredictor } from "../utils/cyclePredictor";

const CycleHistory = ({ cycles = [], loading = false, error = null }) => {
  const prediction = useMemo(() => {
    if (cycles.length < 2) return null;

    try {
      const formattedHistory = cycles.map((cycle) => ({
        startDate: cycle.startDate,
        length: cycle.length,
      }));

      const predictor = new EnhancedCyclePredictor(formattedHistory);
      return predictor.predictNextCycle();
    } catch (err) {
      console.error("Error predicting cycle:", err);
      return null;
    }
  }, [cycles]);

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Cycle History
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
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Cycle History
        </h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          <p className="text-red-600 dark:text-red-400 text-xs mt-2">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Cycle History
      </h2>

      {prediction && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-accent">
            Cycle Prediction
          </h3>
          <p className="text-foreground">
            <strong>Next Start Date:</strong> {prediction.predictedStartDate}
          </p>
          <p className="text-foreground">
            <strong>Confidence Range:</strong>{" "}
            {prediction.confidenceInterval[0]} →{" "}
            {prediction.confidenceInterval[1]}
          </p>
          <p className="text-foreground">
            <strong>Average Cycle Length:</strong>{" "}
            {prediction.averageCycleLength} days
          </p>
          <p className="text-foreground">
            <strong>Irregularity Index:</strong> {prediction.irregularityIndex}
          </p>
        </div>
      )}

      {cycles.length > 0 ? (
        <ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {cycles.map((cycle, index) => (
            <li
              key={cycle.ID || index}
              className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                         bg-light-bg/50 dark:bg-dark-bg/50 
                         transition-colors duration-300 ease"
            >
              <p className="text-foreground">
                <strong>Start Date: </strong>
                {new Date(cycle.startDate).toLocaleDateString()}
              </p>
              <p className="text-foreground">
                <strong>Cycle Length:</strong> {cycle.length} days
              </p>
              <p className="text-foreground">
                <strong>Symptoms:</strong> {cycle.symptoms || "None"}
              </p>
              <p className="text-foreground">
                <strong>Mood:</strong> {cycle.mood || "Not specified"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-foreground/80 text-lg mb-2">
            No cycles logged yet.
          </p>
          <p className="text-foreground/60 text-sm">
            Start tracking your cycles to see your history and predictions here.
          </p>
        </div>
      )}
    </div>
  );
};

CycleHistory.propTypes = {
  cycles: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      startDate: PropTypes.string.isRequired,
      length: PropTypes.number.isRequired,
      symptoms: PropTypes.string,
      mood: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default CycleHistory;
