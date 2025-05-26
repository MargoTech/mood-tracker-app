import { useMood } from "../context/MoodContext";

export default function ReminderBanner() {
  const { shouldRemind } = useMood();

  if (!shouldRemind) return null;

  return (
    <div className="p-4 mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-xl shadow">
      ⏰ It looks like you haven’t logged your mood for a few days. How are you
      feeling today?
    </div>
  );
}
