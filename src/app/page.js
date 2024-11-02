import React from "react";
import CycleForm from "./components/CycleForm";
import HealthInsights from "./components/HealthInsights";
import CycleHistory from "./components/CycleHistory";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out font-body">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold text-center mt-8 dark:text-gray-100 font-display tracking-tight">
            Welcome to the Cycle Tracking App
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Track your cycles accurately, including irregular patterns, and gain
            valuable health insights.
          </p>
        </header>

        <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
          <section className="w-full transition-all duration-200 ease-in-out hover:scale-[1.01]">
            <CycleForm />
          </section>

          <section className="w-full transition-all duration-200 ease-in-out hover:scale-[1.01]">
            <HealthInsights />
          </section>

          <section className="w-full transition-all duration-200 ease-in-out hover:scale-[1.01]">
            <CycleHistory />
          </section>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
