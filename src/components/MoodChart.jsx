import { useMood } from "../context/MoodContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
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

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
        Mood Trends Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
