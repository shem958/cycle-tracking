// This component will allow users to log their mood daily

import { useState } from "react";

const MoodTracker = ({ onLogMood }) => {
  const [mood, setMood] = useState("");

  const handleChange = (e) => {
    setMood(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogMood(mood);
    setMood(""); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Log Mood:
          <input type="text" value={mood} onChange={handleChange} required />
        </label>
      </div>
      <button type="submit">Log Mood</button>
    </form>
  );
};

export default MoodTracker;
