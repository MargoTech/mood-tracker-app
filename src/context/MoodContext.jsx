import { createContext, useContext, useReducer, useEffect } from "react";

const MoodContext = createContext();

const initialMoods = () => {
  const saved = localStorage.getItem("moods");
  return saved ? JSON.parse(saved) : [];
};

function moodReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      return state.filter((m) => m.id !== action.payload);
    case "UPDATE":
      return state.map((m) =>
        m.id === action.payload.id ? action.payload : m
      );
    default:
      return state;
  }
}

export function MoodProvider({ children }) {
  const [moods, dispatch] = useReducer(moodReducer, [], initialMoods);

  useEffect(() => {
    localStorage.setItem("moods", JSON.stringify(moods));
  }, [moods]);

  const addMood = (mood) => {
    const newEntry = {
      id: crypto.randomUUID(),
      mood,
      date: new Date().toLocaleDateString(),
    };
    dispatch({ type: "ADD", payload: newEntry });
  };

  const deleteMood = (id) => {
    dispatch({ type: "DELETE", payload: id });
  };

  const updateMood = (updateMood) => {
    dispatch({ type: "UPDATE", payload: updateMood });
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
