import { useState } from "react";

const SymptomLogger = ({ onLogSymptom }) => {
  const [symptom, setSymptom] = useState("");

  const handleChange = (e) => {
    setSymptom(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogSymptom(symptom);
    setSymptom(""); // Reset form
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Log Symptom:
          <input
            type="text"
            value={symptom}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-600"
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-700"
      >
        Log Symptom
      </button>
    </form>
  );
};

export default SymptomLogger;
