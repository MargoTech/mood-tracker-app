import MoodSelector from "./components/MoodSelector";
import MoodHistory from "./components/MoodHistory";
import MoodChart from "./components/MoodChart";
import MoodFilters from "./context/MoodFilters";
import { useMood } from "./context/MoodContext";

export default function App() {
  const { loading } = useMood();
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Mood Tracker
        </h1>
        <MoodFilters />
        <MoodSelector />
        <MoodHistory />
        <MoodChart />
      </div>
    </main>
  );
}
