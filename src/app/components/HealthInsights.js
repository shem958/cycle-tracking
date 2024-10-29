// This component will provide health insights based on the logged data.

import React from "react";

const HealthInsights = ({ cycles }) => {
  const calculateInsights = () => {
    //Example insight calculation (this should be more complex based on your needs )
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
    <div>
      <h2>Health Insights</h2>
      <p>Total Cycles Logged: {insights.totalCycles}</p>
      <p>Average Cycle Length: {insights.averageLength.toFixed(2)} days</p>
    </div>
  );
};

export default HealthInsights;
