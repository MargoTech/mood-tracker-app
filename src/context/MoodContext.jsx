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
    const newEntry = { mood, date: new Date().toLocaleDateString() };
    setMoods([...moods, newEntry]);
  };

  return (
    <MoodContext.Provider value={{ moods, addMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}
