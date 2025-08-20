"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "../context/AppContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAppContext();
  const pathname = usePathname();

  const isActiveLink = (path) => pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/cycles", label: "Cycle Tracking" },
    { path: "/history", label: "Cycle History" },
    { path: "/insights", label: "Health Insights" },
    { path: "/ovulation", label: "Ovulation Tracker" },
    ...(user ? [{ path: "/pregnancy", label: "Pregnancy" }] : []),
    ...(user ? [{ path: "/postpartum", label: "Postpartum" }] : []),
    ...(user ? [{ path: "/checkups", label: "Checkups" }] : []),
    ...(user ? [{ path: "/recommendations", label: "Recommendations" }] : []),
    ...(user ? [{ path: "/nutrition", label: "Nutrition" }] : []),
    ...(user ? [{ path: "/notifications", label: "Notifications" }] : []),
    ...(user ? [{ path: "/reminders", label: "Reminders" }] : []),
    ...(user ? [{ path: "/community", label: "Community" }] : []),
    ...(user ? [{ path: "/social", label: "Social" }] : []),
    ...(user ? [{ path: "/profile", label: "Profile" }] : []),
    ...(user?.role === "admin"
      ? [{ path: "/admin/users", label: "Admin: Users" }]
      : []),
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
            {user ? (
              <>
                <span className="text-foreground/70 text-sm">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-foreground/70 hover:text-foreground text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-foreground/70 hover:text-foreground text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-foreground/70 hover:text-foreground text-sm"
                >
                  Register
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
