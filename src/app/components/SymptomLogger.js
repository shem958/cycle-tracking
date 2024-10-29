// This component will log symptoms for the user
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Log Symptom:
          <input type="text" value={symptom} onChange={handleChange} required />
        </label>
      </div>
      <button type="submit">Log Symptom</button>
    </form>
  );
};

export default SymptomLogger;
