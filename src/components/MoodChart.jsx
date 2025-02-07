import { useMood } from "../context/MoodContext";

function MoodChart() {
  const { moods } = useMood();
  const moodCounts = moods.reduce((acc, { mood }) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  } {});
  
  return (
    <div>
        <h2>Statistics</h2>
        <ul>
            {Object.entries(moodCounts).map(([mood, count]) => (
                <li>
                    {mood}: {count} times
                </li>
            ))}
        </ul>
    </div>
);
}
export default MoodChart