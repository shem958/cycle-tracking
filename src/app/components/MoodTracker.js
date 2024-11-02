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
    <form
      onSubmit={handleSubmit}
      className="bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease"
    >
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Mood Tracker
      </h2>
      <div className="mb-6">
        <label className="block mb-2 text-foreground">
          How are you feeling today?
          <input
            type="text"
            value={mood}
            onChange={handleChange}
            required
            placeholder="Enter your mood..."
            className="w-full mt-2 p-3 rounded-md
                     bg-light-bg/50 dark:bg-dark-bg/50
                     border border-light-text/20 dark:border-dark-text/20
                     text-foreground placeholder-foreground/50
                     focus:outline-none focus:ring-2 focus:ring-light-text/30 dark:focus:ring-dark-text/30
                     transition-colors duration-300 ease"
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full p-3 rounded-md
                   bg-light-bg dark:bg-dark-bg
                   text-foreground
                   border border-light-text/20 dark:border-dark-text/20
                   hover:bg-light-bg/80 dark:hover:bg-dark-bg/80
                   transition-all duration-300 ease
                   font-medium"
      >
        Log Mood
      </button>
    </form>
  );
};

export default MoodTracker;
