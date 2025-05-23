import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { produce } from "immer";
import {
  getAllMoods,
  addModeToDB,
  deleteMoodFromDB,
  updateMoodInDB,
} from "../db/moodStore";

const MoodContext = createContext();

// const initialMoods = () => {
//   const saved = localStorage.getItem("moods");
//   return saved ? JSON.parse(saved) : [];
// };

function moodReducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "SET":
        return action.payload;
      case "ADD":
        draft.push(action.payload);
        break;
      case "DELETE":
        return draft.filter((m) => m.id === action.payload);
      case "UPDATE": {
        const index = draft.findIndex((m) => m.id === action.payload);
        if (index !== -1) {
          draft[index] = action.payload;
        }
        break;
      }
      default:
        return;
    }
  });
}

export function MoodProvider({ children }) {
  const [moods, dispatch] = useReducer(moodReducer, []);
  const [loading, setLoading] = useState(true);

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
