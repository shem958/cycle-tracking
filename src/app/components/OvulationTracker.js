import React from "react";

const OvulationTracker = ({ cycleLength, startDate }) => {
  const calculateOvulationDate = () => {
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));
    return ovulationDate.toLocaleDateString();
  };

  const calculateFertileWindow = () => {
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    return {
      start: fertileStart.toLocaleDateString(),
      end: fertileEnd.toLocaleDateString(),
    };
  };

  const fertileWindow = calculateFertileWindow();

  return (
    <div className="bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Ovulation Tracker
      </h2>

      <div className="space-y-6">
        <div
          className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                    bg-light-bg/50 dark:bg-dark-bg/50 
                    transition-colors duration-300 ease"
        >
          <h3 className="text-lg font-medium text-foreground mb-3">
            Estimated Ovulation Date
          </h3>
          <p className="text-foreground text-lg font-semibold">
            {calculateOvulationDate()}
          </p>
        </div>

        <div
          className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                    bg-light-bg/50 dark:bg-dark-bg/50 
                    transition-colors duration-300 ease"
        >
          <h3 className="text-lg font-medium text-foreground mb-3">
            Fertile Window
          </h3>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="font-medium">Start:</span>{" "}
              <span className="text-foreground/90">{fertileWindow.start}</span>
            </p>
            <p className="text-foreground">
              <span className="font-medium">End:</span>{" "}
              <span className="text-foreground/90">{fertileWindow.end}</span>
            </p>
          </div>
        </div>

        <div
          className="mt-4 p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md 
                    bg-light-bg/30 dark:bg-dark-bg/30 
                    text-foreground/80 text-sm
                    transition-colors duration-300 ease"
        >
          <p>
            Note: These dates are estimates based on a typical 28-day cycle.
            Your actual fertile window may vary. Consider tracking additional
            fertility signs for more accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

OvulationTracker.defaultProps = {
  cycleLength: 28, // Default cycle length
  startDate: new Date().toISOString(), // Default to current date
};

export default OvulationTracker;
