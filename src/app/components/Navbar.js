"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const isActiveLink = (path) => pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/history", label: "Cycle History" },
    { path: "/insights", label: "Health Insights" },
    { path: "/ovulation", label: "Ovulation Tracker" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-light-text/10 dark:border-dark-text/10 transition-colors duration-300 ease font-navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <ul className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease ${
                    isActiveLink(link.path)
                      ? "bg-light-bg/80 dark:bg-dark-bg/80 text-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-light-bg/50 dark:hover:bg-dark-bg/50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            {/* ThemeToggle component can be placed here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
