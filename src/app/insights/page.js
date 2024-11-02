// src/app/insights/page.js
import HealthInsights from "@/app/components/HealthInsights";

export default function HealthInsightsPage() {
  const cycles = []; // Replace with actual cycle data if available

  return (
    <div className="p-6">
      <HealthInsights cycles={cycles} />
    </div>
  );
}
