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
  addMoodToDB,
  deleteMoodFromDB,
  updateMoodInDB,
} from "../db/moodStore";

const MoodContext = createContext();

function moodReducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "SET":
        return action.payload;
      case "ADD":
        draft.push(action.payload);
        break;
      case "DELETE":
        const index = draft.findIndex((m) => m.id === action.payload);
        if (index !== -1) draft.splice(index, 1);
        break;
      case "UPDATE": {
        const index = draft.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          draft[index] = action.payload;
        }
        break;
      }
      default:
        break;
    }
  });
}

export function MoodProvider({ children }) {
  const [moods, dispatch] = useReducer(moodReducer, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMoods() {
      try {
        const all = await getAllMoods();
        dispatch({ type: "SET", payload: all });
      } catch (err) {
        console.error("Failed to load moods from IndexedDB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMoods();
  }, []);

  const addMood = async (mood) => {
    const newEntry = {
      id: crypto.randomUUID(),
      mood,
      date: new Date().toLocaleDateString(),
    };
    await addMoodToDB(newEntry);
    dispatch({ type: "ADD", payload: newEntry });
  };

  const deleteMood = async (id) => {
    await deleteMoodFromDB(id);
    dispatch({ type: "DELETE", payload: id });
  };

  const updateMood = async (updated) => {
    await updateMoodInDB(updated);
    dispatch({ type: "UPDATE", payload: updated });
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
