"use client";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { EnhancedCyclePredictor } from "../utils/cyclePredictor";

const CycleHistory = ({ cycles = [] }) => {
  const prediction = useMemo(() => {
    if (cycles.length < 2) return null;

    const formattedHistory = cycles.map((cycle) => ({
      startDate: cycle.startDate,
      length: cycle.length,
    }));

    const predictor = new EnhancedCyclePredictor(formattedHistory);
    return predictor.predictNextCycle();
  }, [cycles]);

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
              key={index}
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
        <p className="text-foreground/80">No cycles logged yet.</p>
      )}
    </div>
  );
};

CycleHistory.propTypes = {
  cycles: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string.isRequired,
      length: PropTypes.number.isRequired,
      symptoms: PropTypes.string,
      mood: PropTypes.string,
    })
  ).isRequired,
};

export default CycleHistory;
