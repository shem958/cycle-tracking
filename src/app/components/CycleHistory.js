// This component will display the user's cycle history
import React from "react";
import PropTypes from "prop-types";

const CycleHistory = ({ cycles = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Cycle History
      </h2>
      {cycles.length > 0 ? (
        <ul className="space-y-4">
          {cycles.map((cycle, index) => (
            <li
              key={index}
              className="p-4 border border-gray-300 rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Start Date: </strong>
                {new Date(cycle.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Cycle Length:</strong> {cycle.length} days
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Symptoms:</strong> {cycle.symptoms || "None"}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Mood:</strong> {cycle.mood || "Not specified"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          No cycles logged yet.
        </p>
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
