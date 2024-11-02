import React from "react";
import PropTypes from "prop-types";

const HealthInsights = ({ cycles = [] }) => {
  const calculateInsights = () => {
    const totalCycles = cycles.length;
    const averageLength = totalCycles
      ? cycles.reduce((sum, cycle) => sum + cycle.length, 0) / totalCycles
      : 0;
    return {
      totalCycles,
      averageLength,
    };
  };

  const insights = calculateInsights();

  return (
    <div className="flex-1 bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease h-full">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Health Insights
      </h2>
      <div className="space-y-4">
        <div
          className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                    bg-light-bg/50 dark:bg-dark-bg/50 
                    transition-colors duration-300 ease"
        >
          <h3 className="text-lg font-medium text-foreground mb-2">
            Cycle Summary
          </h3>
          <p className="text-foreground transition-colors duration-300 ease mb-3">
            <strong>Total Cycles Logged:</strong>{" "}
            <span className="text-foreground/90">{insights.totalCycles}</span>
          </p>
          <p className="text-foreground transition-colors duration-300 ease">
            <strong>Average Cycle Length:</strong>{" "}
            <span className="text-foreground/90">
              {insights.averageLength.toFixed(2)} days
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

HealthInsights.propTypes = {
  cycles: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string.isRequired,
      length: PropTypes.number.isRequired,
      symptoms: PropTypes.string,
      mood: PropTypes.string,
    })
  ).isRequired,
};

export default HealthInsights;
