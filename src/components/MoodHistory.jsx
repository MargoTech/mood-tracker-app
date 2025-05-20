import { useMood } from "../context/MoodContext";
import { useState } from "react";

function MoodHistory() {
  const { moods, deleteMood, updateMood } = useMood();
  const [loadingId, setLoadingId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editedMood, setEditedMood] = useState("");

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await deleteMood(id);
    } catch (error) {
      console.error("Failed to delete mood entry:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdate = (entry) => {
    setEditId(entry.id);
    setEditedMood(entry.mood);
  };

  const handleSave = () => {
    updateMood({
      id: editId,
      mood: editedMood,
      date: new Date().toLocaleDateString(),
    });
    setEditId(null);
    setEditedMood("");
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold md-4 text-gray-700">Mood History</h2>
      <ul className="space-y-2">
        {moods.length === 0 && (
          <li className="text-gray-500 italic">No moods yet</li>
        )}
        {moods.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-xl shadow"
          >
            {editId === entry.id ? (
              <div>
                <select
                  value={editedMood}
                  onChange={(e) => setEditedMood(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 mr-2"
                >
                  <option>Great</option>
                  <option>Good</option>
                  <option>Okay</option>
                  <option>Not Great</option>
                  <option>Bad</option>
                </select>
                <button
                  onClick={handleSave}
                  className="text-green-600 hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>
                  <strong>{entry.date}</strong>: {entry.mood}
                </span>
                <div>
                  <button
                    onClick={() => handleUpdate(entry)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={loadingId === entry.id}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  {loadingId === entry.id ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodHistory;
