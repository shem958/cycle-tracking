// src/app/ovulation/page.js
import OvulationTracker from "@/app/components/OvulationTracker";

export default function OvulationTrackerPage() {
  const cycleLength = 28; // You can replace this with actual data if available
  const startDate = new Date().toISOString(); // You can also set a specific start date

  return (
    <div className="p-6">
      <OvulationTracker cycleLength={cycleLength} startDate={startDate} />
    </div>
  );
}
