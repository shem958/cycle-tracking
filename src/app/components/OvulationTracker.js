import React from "react";

const OvulationTracker = ({ cycleLength, startDate }) => {
  const calculateOvulationDate = () => {
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14)); // Ovulation is typically 14 days before the next cycle
    return ovulationDate.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Ovulation Tracker
      </h2>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        Estimated Ovulation Date: <strong>{calculateOvulationDate()}</strong>
      </p>
    </div>
  );
};

export default OvulationTracker;
