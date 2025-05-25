import { useMood } from "../context/MoodContext";

export default function ReminderBanner() {
  const { shouldRemind } = useMood();

  if (!shouldRemind) return null;

  return (
    <div>
      ⏰ It looks like you haven’t logged your mood for a few days. How are you
      feeling today?
    </div>
  );
}
