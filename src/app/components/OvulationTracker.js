// This component will help users track their ovulation

import React from "react";
const ovulationTracker = ({ cycleLength, startDate }) => {
  const calculateOvulationDate = () => {
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14)); // Ovulation is typically 14 days before the next cycle
    return ovulationDate.toLocaleDateString();
  };
  return (
    <div>
      <h2>Ovulation Tracker</h2>
      <p>Estimated Ovulation Date: {calculateOvulationDate()}</p>
    </div>
  );
};

export default ovulationTracker;
