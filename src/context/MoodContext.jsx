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
  const [shouldRemind, setShouldRemind] = useState(false);
  const [syncQueue, setSyncQueue] = useState([]);

  useEffect(() => {
    async function loadMoods() {
      try {
        const all = await getAllMoods();
        dispatch({ type: "SET", payload: all });

        if (all.length > 0) {
          const sorted = [...all].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          const lastDate = new Date(sorted[0].date);
          const now = new Date();
          const diffInDays = (now - lastDate) / (1000 * 60 * 60 * 24);

          if (diffInDays > 2) {
            setShouldRemind(true);
          }
        } else {
          setShouldRemind(true);
        }
      } catch (err) {
        console.error("Failed to load moods from IndexedDB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMoods();
  }, []);

  useEffect(() => {
    if (!syncQueue.length) return;

    const interval = setInterval(async () => {
      for (let mood of syncQueue) {
        try {
          await fakeApiSync(mood);

          const updated = { ...mood, synced: true };
          await updateMoodInDB(updated);
          dispatch({ type: "UPDATE", payload: updated });

          setSyncQueue((q) => q.filter((m) => m.id !== mood.id));
        } catch (err) {
          console.warn("Sync failed, will retry...", mood.id);
        }
      }
    }, 5000);

    const fakeApiSync = (mood) => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          if (Math.random() < 0.9) res();
          else rej("Random API fail");
        }, 1000);
      });
    };

    return () => clearInterval(interval);
  }, [syncQueue]);

  const addMood = async (mood) => {
    const newEntry = {
      id: crypto.randomUUID(),
      mood,
      date: new Date().toISOString().split("T")[0],
      synced: false,
    };
    await addMoodToDB(newEntry);
    setSyncQueue((prev) => [...prev, newEntry]);
    dispatch({ type: "ADD", payload: newEntry });
    setShouldRemind(false);
  };

  const deleteMood = async (id) => {
    await deleteMoodFromDB(id);
    dispatch({ type: "DELETE", payload: id });
  };

  const updateMood = async (updated) => {
    await updateMoodInDB(updated);
    dispatch({ type: "UPDATE", payload: updated });
  };

  const syncAll = async () => {
    for (let mood of moods.filter((m) => !m.synced)) {
      try {
        const updated = { ...mood, synced: true };
        await fakeApiSync(updated);
        await updateMoodInDB(updated);
        dispatch({ type: "UPDATE", payload: updated });
      } catch (err) {
        console.warm("Manual sync failed for:", mood.id);
      }
    }
  };

  return (
    <MoodContext.Provider
      value={{ moods, addMood, deleteMood, updateMood, shouldRemind, syncAll }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  return useContext(MoodContext);
}
