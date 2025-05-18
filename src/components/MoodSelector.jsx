import { useState } from "react";
import { useMood } from "../context/MoodContext";

const moodList = [
  { emoji: "😊", label: "Great", color: "bg-pink-200" },
  { emoji: "😌", label: "Good", color: "bg-purple-200" },
  { emoji: "😐", label: "Okay", color: "bg-yellow-200" },
  { emoji: "😓", label: "Not Great", color: "bg-blue-200" },
  { emoji: "😡", label: "Bad", color: "bg-red-200" },
];

export default function MoodSelector() {
  const { addMood } = useMood();
  const [loadingLabel, setLoadingLabel] = useState(null);

  const handleMoodClick = async (label) => {
    setLoadingLabel(label);
    try {
      await addMood(label);
    } catch (error) {
      console.error("Something went wrong. Try again later.", error);
    } finally {
      setLoadingLabel(null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <h2 className="text-xl font-semibold">How are you feeling?</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {moodList.map((m) => (
          <button
            key={m.label}
            onClick={() => handleMoodClick(m.label)}
            disabled={loadingLabel === m.label}
            className={`px-4 py-2 rounded-xl shadow-md ${
              loadingLabel === m.label
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            {m.emoji} {loadingLabel === m.label ? "Saving..." : m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
