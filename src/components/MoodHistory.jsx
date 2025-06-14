import { useMood } from "../context/MoodContext";
import { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";

function MoodHistory() {
  const { moods, filteredMoods, deleteMood, updateMood } = useMood();
  const [loadingId, setLoadingId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editedMood, setEditedMood] = useState("");
  const [editedNote, setEditedNote] = useState("");

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
    setEditedNote(entry.note || "");
  };

  const handleSave = async () => {
    try {
      await updateMood({
        id: editId,
        mood: editedMood,
        note: editedNote,
        date: new Date().toISOString().split("T")[0],
        synced: false,
      });
    } catch (err) {
      console.error("Failed to update mood:", err);
    } finally {
      setEditId(null);
      setEditedMood("");
      setEditedNote("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-rose-100">
      <h2 className="text-xl font-bold md-4 text-gray-700"> 📝 Mood History</h2>
      <p className="text-sm text-gray-500 mb-2">
        Total entries: {moods.length}
      </p>

      {filteredMoods.length === 0 && (
        <p className="italic text-gray-500 mb-4">
          No moods match your filters.
        </p>
      )}

      <ul className="space-y-2">
        {filteredMoods.map((entry) => (
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
                <input
                  type="text"
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  placeholder="Optional note"
                  className="border p-1 rounded-md w-full mt-2"
                />

                <div>
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
              </div>
            ) : (
              <>
                <span className="text-gray-700 font-medium">
                  <strong>{entry.date}</strong>: {entry.mood}
                </span>
                {entry.note && (
                  <p className="text-sm text-gray-600 mt-1">📝 {entry.note}</p>
                )}
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
