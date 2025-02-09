import { useMood } from "../context/MoodContext";

function MoodHistory() {
  const { moods } = useMood();

  return (
    <div>
      <h2>History of the mood</h2>
      <ul>
        {moods.map((entry, index) => (
          <li key={index}>
            {entry.date}: {entry.mood}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodHistory;
