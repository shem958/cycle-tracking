// This component will display the user's cycle history
import React from "react";

const CycleHistory = ({ cycles }) => {
  return (
    <div>
      <h2>Cycle History</h2>
      {cycles.length > 0 ? (
        <ul>
          {cycles.map((cycle, index) => (
            <li key={index}>
              <p>
                <strong>Start Date: </strong>
                {new Date(cycle.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Cycle Length:</strong>
                {cycle.length} days
              </p>
              <p>
                <strong>Symptoms:</strong>
                {cycle.symptoms}
              </p>
              <p>
                <strong>Mood:</strong>
                {cycle.mood}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cycles logged yet.</p>
      )}
    </div>
  );
};

export default CycleHistory;
