import { useMood } from "../context/MoodContext";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const moodToNumber = (mood) => {
  const map = {
    Great: 5,
    Good: 4,
    Okay: 3,
    "Not Great": 2,
    Bad: 1,
  };
  return map[mood] ?? 0;
};

export default function MoodChart() {
  const { moods } = useMood();

  const data = moods.map(({ mood, date }) => ({
    date,
    mood: moodToNumber(mood),
  }));

  // const moodCounts = moods.reduce((acc, { mood }) => {
  //   acc[mood] = (acc[mood] || 0) + 1;
  //   return acc;
  // }, {});

  return (
    <div>
      <h2>Statistics</h2>
      <ul>
        {Object.entries(moodCounts).map(([mood, count]) => (
          <li key={mood}>
            {mood}: {count} times
          </li>
        ))}
      </ul>
    </div>
  );
}
