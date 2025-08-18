import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/globals.css";

import { Outfit, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import { AppProvider } from "./context/AppContext"; // Added context

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable}`}
    >
      <body>
        <AppProvider>
          <Navbar className={poppins.variable} /> {/* Apply Poppins */}
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-semibold">Cycle Tracker</h1>
            <ThemeToggle />
          </div>
          <main className="container mx-auto px-4">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
