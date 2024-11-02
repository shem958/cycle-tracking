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
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block mb-2 text-gray-800 dark:text-gray-200">
          Log Mood:
          <input
            type="text"
            value={mood}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Log Mood
      </button>
    </form>
  );
};

export default MoodTracker;
