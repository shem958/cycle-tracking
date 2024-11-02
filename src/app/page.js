import CycleForm from "./components/CycleForm";
import HealthInsights from "./components/HealthInsights";
import CycleHistory from "./components/CycleHistory";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center mt-8">
        Welcome to the Cycle Tracking App
      </h1>
      <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto">
        Track your cycles accurately, including irregular patterns, and gain
        valuable health insights.
      </p>
      <div className="flex flex-col items-center space-y-6">
        <CycleForm />
        <HealthInsights />
        <CycleHistory />
      </div>
    </div>
  );
}
