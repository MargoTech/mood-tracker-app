import { useMood } from "../context/MoodContext";

const moodList = [
  { emoji: "😊", label: "Great" },
  { emoji: "😌", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😓", label: "Not Great" },
  { emoji: "😡", label: "Bad" },
];

function MoodSelector() {
  const { addMode } = useMood();
  return (
    <div>
      <h2>How are you feeling?</h2>
      {moodList.map((m) => (
        <button key={m.lebel} onClick={() => addMode(m.lebel)}>
          {m.emoji} {m.lebel}
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;
