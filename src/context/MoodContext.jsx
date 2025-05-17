import { createContext, useState, useContext, useEffect } from "react";

const MoodContext = createContext();

export function MoodProvider({ children }) {
  const [moods, setMoods] = useState(() => {
    const savedMoods = localStorage.getItem("moods");
    return savedMoods ? JSON.parse(savedMoods) : [];
  });

  useEffect(() => {
    localStorage.setItem("moods", JSON.stringify(moods));
  }, [moods]);

  const addMood = (mood) => {
    const newEntry = {
      id: crypto.randomUUID(),
      mood,
      date: new Date().toLocaleDateString(),
    };
    setMoods([...moods, newEntry]);
  };

  const deleteMood = (id) => {
    setMoods((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMood = (updateMood) => {
    setMoods((prev) =>
      prev.map((mood) => (mood.id === updateMood.id ? updateMood : mood))
    );
  };

  return (
    <MoodContext.Provider value={{ moods, addMood, deleteMood, updateMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}
