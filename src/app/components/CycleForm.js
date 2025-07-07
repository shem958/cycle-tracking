"use client";
import { useEffect, useState } from "react";
import { Calendar, Activity, Heart, Clock, Trash2, Pencil } from "lucide-react";

const CycleForm = () => {
  const [cycleData, setCycleData] = useState({
    startDate: "",
    length: "",
    symptoms: "",
    mood: "",
  });
  const [cycles, setCycles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCycles = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cycles");
      const data = await res.json();
      setCycles(data);
    } catch (error) {
      console.error("Failed to fetch cycles:", error);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCycleData({ ...cycleData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:8080/api/cycles/${editId}`
      : "http://localhost:8080/api/cycles";

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cycleData),
      });

      if (res.ok) {
        setCycleData({ startDate: "", length: "", symptoms: "", mood: "" });
        setIsEditing(false);
        setEditId(null);
        fetchCycles();
      } else {
        console.error("Failed to save cycle");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleEdit = (cycle) => {
    setCycleData({
      startDate: cycle.startDate,
      length: cycle.length,
      symptoms: cycle.symptoms,
      mood: cycle.mood,
    });
    setEditId(cycle.ID); // Ensure backend sends "ID"
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/cycles/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCycles();
      } else {
        console.error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-pink-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-gray-700 dark:text-gray-200 text-xl">
          Track your cycles accurately and gain valuable health insights.
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#1B2433] shadow-xl"
      >
        <h2 className="text-3xl font-semibold mb-8 text-white text-center">
          {isEditing ? "Edit Cycle" : "Cycle Journal"}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <label className="block text-sm text-gray-300">
              <Calendar className="inline w-4 h-4 mr-2" />
              Start Date
              <input
                type="date"
                name="startDate"
                value={cycleData.startDate}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
            </label>

            <label className="block text-sm text-gray-300">
              <Clock className="inline w-4 h-4 mr-2" />
              Cycle Length (Days)
              <input
                type="number"
                name="length"
                value={cycleData.length}
                onChange={handleChange}
                min="1"
                max="99"
                required
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
            </label>

            <label className="block text-sm text-gray-300">
              <Heart className="inline w-4 h-4 mr-2" />
              Mood
              <input
                type="text"
                name="mood"
                value={cycleData.mood}
                onChange={handleChange}
                placeholder="How are you feeling?"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200"
              />
            </label>
          </div>

          <label className="block text-sm text-gray-300">
            <Activity className="inline w-4 h-4 mr-2" />
            Symptoms & Notes
            <textarea
              name="symptoms"
              value={cycleData.symptoms}
              onChange={handleChange}
              rows="12"
              placeholder="Describe symptoms or notes..."
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#2A3441] text-gray-200 resize-none"
            />
          </label>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-lg"
          >
            {isEditing ? "Update Entry" : "Save Entry"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditId(null);
                setCycleData({
                  startDate: "",
                  length: "",
                  symptoms: "",
                  mood: "",
                });
              }}
              className="text-sm text-gray-300 hover:text-white underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* List of entries */}
      <div className="max-w-4xl mx-auto mt-12">
        <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">
          Past Entries
        </h3>
        <ul className="space-y-4">
          {cycles.map((entry) => (
            <li
              key={entry.ID}
              className="bg-white dark:bg-[#2A3441] rounded-xl p-4 shadow flex justify-between items-center"
            >
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {entry.startDate} - {entry.length} days
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Mood: {entry.mood} | Symptoms: {entry.symptoms}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.ID)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CycleForm;
