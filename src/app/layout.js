// src/app/layout.js

import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle"; // Import the ThemeToggle component
import "./styles/globals.css";

export const metadata = {
  title: "Cycle Tracking App",
  description:
    "An app to accurately track and predict menstrual cycles, including irregular cycles.",
};

function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (error) {
    console.error(error);
    return <div>Something went wrong.</div>;
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-semibold">Cycle Tracker</h1>
          <ThemeToggle /> {/* Add ThemeToggle here */}
        </div>
        <main className="container mx-auto px-4">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </body>
    </html>
  );
}
