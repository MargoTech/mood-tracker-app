import MoodSelector from "./components/MoodSelector";
import MoodHistory from "./components/MoodHistory";
import MoodChart from "./components/MoodChart";

function App() {
  return (
    <div>
      <h1>Mood Tracker</h1>
      <MoodSelector />
      <MoodHistory />
      <MoodChart />
    </div>
  );
}

export default App;
