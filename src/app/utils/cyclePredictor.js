export class EnhancedCyclePredictor {
  constructor(history = []) {
    this.history = history; // List of { startDate, length }
  }

  predictNextCycle() {
    if (this.history.length < 2) return null;

    const sorted = [...this.history].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    const lengths = [];
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].startDate);
      const curr = new Date(sorted[i].startDate);
      lengths.push((curr - prev) / (1000 * 60 * 60 * 24));
    }

    const avgLength = lengths.reduce((a, b) => a + b) / lengths.length;
    const stdDev = Math.sqrt(
      lengths.map((x) => Math.pow(x - avgLength, 2)).reduce((a, b) => a + b) /
        lengths.length
    );

    const lastStart = new Date(sorted[sorted.length - 1].startDate);
    const predicted = new Date(
      lastStart.getTime() + avgLength * 24 * 60 * 60 * 1000
    );

    const fertileStart = new Date(
      lastStart.getTime() + (avgLength - 14 - 5) * 24 * 60 * 60 * 1000
    );
    const fertileEnd = new Date(
      lastStart.getTime() + (avgLength - 14 + 5) * 24 * 60 * 60 * 1000
    );

    return {
      predictedStartDate: predicted.toISOString().split("T")[0],
      confidenceInterval: [
        new Date(predicted.getTime() - stdDev * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        new Date(predicted.getTime() + stdDev * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      ],
      averageCycleLength: avgLength.toFixed(1),
      irregularityIndex: stdDev.toFixed(2),
      fertileWindow: [
        fertileStart.toISOString().split("T")[0],
        fertileEnd.toISOString().split("T")[0],
      ],
    };
  }

  addCycle(cycleEntry) {
    this.history.push(cycleEntry);
  }
}
