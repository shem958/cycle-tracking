import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/history">Cycle History</Link>
        </li>
        <li>
          <Link to="/insights">Health Insights</Link>
        </li>
        <li>
          <Link to="/ovulation">Ovulation Tracker</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
