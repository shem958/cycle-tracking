import React from "react";
import PropTypes from "prop-types";

const CycleHistory = ({ cycles = [] }) => {
  return (
    <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Cycle History
      </h2>
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
