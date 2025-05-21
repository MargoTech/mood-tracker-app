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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-3xl shadow-xl border border-rose-100">
      <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">
        {" "}
        💖How are you feeling?
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {moodList.map((m) => (
          <button
            key={m.label}
            onClick={() => handleMoodClick(m.label)}
            disabled={loadingLabel === m.label}
            aria-label={`Select mood: ${m.label}`}
            className={`flex flex-col items-center justify-center rounded-2xl p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:ring-2 hover:ring-rose-300 ${
              m.color
            } ${loadingLabel === m.label ? "ring-4 ring-rose-400" : ""}`}
          >
            <span className="text-4xl">
              {loadingLabel === m.label ? "⏳" : m.emoji}
            </span>
            <span className="mt-2 text-sm font-medium text-gray-700">
              {loadingLabel === m.label ? "Saving..." : m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
