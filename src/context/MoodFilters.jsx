import { useMood } from "./MoodContext";

export default function MoodFilters() {
  const { filter, setFilter } = useMood();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
      <select
        className="p-2 border rounded-xl"
        value={filter.mood}
        onChange={(e) => setFilter((f) => ({ ...f, mood: e.target.value }))}
      >
        <option value="All">All Moods</option>
        <option value="Great">Great</option>
        <option value="Good">Good</option>
        <option value="Okay">Okay</option>
        <option value="Not Great">Not Great</option>
        <option value="Bad">Bad</option>
      </select>

      <select
        className="p-2 border rounded-xl"
        value={filter.days}
        onChange={(e) => setFilter((f) => ({ ...f, Number(e.target.value) }))}
      >
        <option value={0}>All Time</option>
        <option value={1}>Last 1 Day</option>
        <option value={3}>Last 3 Days</option>
        <option value={7}>Last 7 Days</option>
      </select>
    </div>
  );
}
