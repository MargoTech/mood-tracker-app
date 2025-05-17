import { useMood } from "../context/MoodContext";
import { useState } from "react";

function MoodHistory() {
  const { moods, deleteMood } = useMood();
  const [loadingId, setLoadingId] = useState(null);

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold md-4">Mood History</h2>
      <ul className="space-y-2">
        {moods.length === 0 && (
          <li className="text-gray-500 italic">No moods yet</li>
        )}
        {moods.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-xl shadow"
          >
            <span>
              <strong>{entry.date}</strong>: {entry.mood}
            </span>
            <button
              onClick={() => handleDelete(entry.id)}
              disabled={loadingId === entry.id}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {loadingId === entry.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodHistory;
