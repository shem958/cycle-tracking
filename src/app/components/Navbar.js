import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md">
      <ul className="flex space-x-4">
        <li>
          <Link
            href="/"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/history"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
          >
            Cycle History
          </Link>
        </li>
        <li>
          <Link
            href="/insights"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
          >
            Health Insights
          </Link>
        </li>
        <li>
          <Link
            href="/ovulation"
            className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200"
          >
            Ovulation Tracker
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
