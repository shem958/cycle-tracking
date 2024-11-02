import { useState } from "react";

const CommonSymptoms = [
  "Cramps",
  "Headache",
  "Fatigue",
  "Bloating",
  "Mood changes",
  "Breast tenderness",
  "Back pain",
  "Nausea",
];

const SymptomLogger = ({ onLogSymptom }) => {
  const [symptom, setSymptom] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    setSymptom(e.target.value);
    setShowSuggestions(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptom.trim()) {
      onLogSymptom(symptom);
      setSymptom(""); // Reset form
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSymptom(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-md transition-colors duration-300 ease">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Symptom Logger
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className="block mb-2 text-foreground">
            How are you feeling today?
            <input
              type="text"
              value={symptom}
              onChange={handleChange}
              placeholder="Enter symptom..."
              className="w-full mt-2 p-3 rounded-md
                       bg-light-bg/50 dark:bg-dark-bg/50
                       border border-light-text/20 dark:border-dark-text/20
                       text-foreground placeholder-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-light-text/30 dark:focus:ring-dark-text/30
                       transition-colors duration-300 ease"
            />
          </label>

          {/* Suggestions dropdown */}
          {showSuggestions && symptom && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-light-text/20 dark:border-dark-text/20 rounded-md shadow-lg">
              {CommonSymptoms.filter((s) =>
                s.toLowerCase().includes(symptom.toLowerCase())
              ).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 text-foreground/90
                           hover:bg-light-bg/50 dark:hover:bg-dark-bg/50
                           transition-colors duration-200 ease"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div
            className="p-4 border border-light-text/20 dark:border-dark-text/20 rounded-md
                        bg-light-bg/30 dark:bg-dark-bg/30"
          >
            <h3 className="text-sm font-medium text-foreground/80 mb-3">
              Common Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {CommonSymptoms.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-sm rounded-full
                           border border-light-text/20 dark:border-dark-text/20
                           bg-light-bg/50 dark:bg-dark-bg/50
                           text-foreground/80
                           hover:bg-light-bg dark:hover:bg-dark-bg
                           transition-colors duration-200 ease"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!symptom.trim()}
          className="w-full p-3 rounded-md
                   bg-light-bg dark:bg-dark-bg
                   text-foreground
                   border border-light-text/20 dark:border-dark-text/20
                   hover:bg-light-bg/80 dark:hover:bg-dark-bg/80
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 ease
                   font-medium"
        >
          Log Symptom
        </button>
      </form>
    </div>
  );
};

export default SymptomLogger;
