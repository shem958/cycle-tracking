import { useState } from "react";

const CycleForm = ({ onSubmit }) => {
  const [cycleData, setCycleData] = useState({
    startDate: "",
    length: "",
    symptoms: "",
    mood: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCycleData({ ...cycleData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cycleData);
    setCycleData({ startDate: "", length: "", symptoms: "", mood: "" }); //Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={cycleData.startDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Cycle Length (Days):
          <input
            type="number"
            name="length"
            value={cycleData.length}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Symptoms:
          <textarea
            name="symptoms"
            value={cycleData.symptoms}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Mood:
          <input
            type="text"
            name="mood"
            value={cycleData.mood}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Log Cycle</button>
    </form>
  );
};

export default CycleForm;
