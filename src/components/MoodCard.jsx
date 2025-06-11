import { format } from "date-fns";
export default function MoodCard({ mood }) {
  const { mood: moodType, note, date, synced } = mood;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold capitalize">{moodType}</h2>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            synced
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {synced ? "Synced" : "Pending"}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
        {note || <em>No note provided.</em>}
      </p>
      <div className="text-right text-xs text-gray-400">
        {format(new Date(date), "dd MMM yyyy")}
      </div>
    </div>
  );
}
