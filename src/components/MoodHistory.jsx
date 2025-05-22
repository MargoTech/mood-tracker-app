import { useMood } from "../context/MoodContext";
import { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";

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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-rose-100">
      <h2 className="text-xl font-bold md-4 text-gray-700"> 📝 Mood History</h2>
      <ul className="space-y-2">
        {moods.length === 0 && (
          <li className="text-gray-500 italic">No moods yet</li>
        )}
        {moods.map((entry) => (
          <li
            key={entry.id}
            className="bg-rose-50 p-4 rounded-2xl flex items-center justify-between shadow hover:shadow-lg transition-shadow"
          >
            {editId === entry.id ? (
              <div className="flex-1">
                <select
                  value={editedMood}
                  onChange={(e) => setEditedMood(e.target.value)}
                  className="rounded-md border border-gray-300 p-1 mr-2"
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
                  <Save className="inline w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="text-gray-500 hover:underline"
                >
                  <X className="inline w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-700 font-medium">
                  <strong>{entry.date}</strong>: {entry.mood}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(entry)}
                    className="text-blue-500 hover:underline"
                  >
                    <Pencil className="w-5 h-5" />
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
