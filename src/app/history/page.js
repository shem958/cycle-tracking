// src/app/history/page.js
import CycleHistory from "@/app/components/CycleHistory";

export default function CycleHistoryPage() {
  const cycles = []; // You can replace this with actual cycle data if available

  return (
    <div className="p-6">
      <CycleHistory cycles={cycles} />
    </div>
  );
}
