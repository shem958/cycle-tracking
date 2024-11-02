// This component will provide health insights based on the logged data.
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Health Insights
      </h2>
      <p className="text-gray-800 dark:text-gray-200">
        <strong>Total Cycles Logged:</strong> {insights.totalCycles}
      </p>
      <p className="text-gray-800 dark:text-gray-200">
        <strong>Average Cycle Length:</strong>{" "}
        {insights.averageLength.toFixed(2)} days
      </p>
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
