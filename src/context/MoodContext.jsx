import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useMemo,
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
  switch (action.type) {
    case "SET":
      return action.payload;
    default:
      return produce(state, (draft) => {
        switch (action.type) {
          case "ADD":
            draft.push(action.payload);
            break;
          case "DELETE":
            const index = draft.findIndex((m) => m.id === action.payload);
            if (index !== -1) draft.splice(index, 1);
            break;
          case "UPDATE":
            const i = draft.findIndex((m) => m.id === action.payload.id);
            if (i !== -1) draft[i] = action.payload;
            break;
        }
      });
  }
}

export function MoodProvider({ children }) {
  const [moods, dispatch] = useReducer(moodReducer, []);
  const [loading, setLoading] = useState(true);
  const [shouldRemind, setShouldRemind] = useState(false);
  const [syncQueue, setSyncQueue] = useState([]);
  const [filter, setFilter] = useState({ mood: "All", days: 0 });

  const simulateApiSync = (mood) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        Math.random() < 0.9 ? res() : rej("Random API fail");
      }, 1000);
    });
  };

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
    let cancelled = false;

    async function syncNext() {
      if (cancelled || !syncQueue.length) return;

      for (let mood of syncQueue) {
        try {
          await simulateApiSync(mood);
          const updated = { ...mood, synced: true };
          await updateMoodInDB(updated);
          dispatch({ type: "UPDATE", payload: updated });
          setSyncQueue((q) => q.filter((m) => m.id !== mood.id));
        } catch {
          console.warn("Sync failed for", mood.id);
        }
      }

      setTimeout(syncNext, 5000);
    }

    syncNext();

    return () => {
      cancelled = true;
    };
  }, [syncQueue]);

  const createMoodEntry = (mood, note = "") => ({
    id: crypto.randomUUID(),
    mood,
    date: new Date().toISOString().split("T")[0],
    note,
    synced: false,
  });

  const addMood = async (mood, note = "") => {
    try {
      const newEntry = createMoodEntry(mood, note);

      await addMoodToDB(newEntry);
      setSyncQueue((prev) => [...prev, newEntry]);
      dispatch({ type: "ADD", payload: newEntry });
      setShouldRemind(false);
    } catch (err) {
      console.error("Failed to add mood:", err);
    }
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
        await simulateApiSync(mood);

        const updated = { ...mood, synced: true };
        await updateMoodInDB(updated);
        dispatch({ type: "UPDATE", payload: updated });
      } catch (err) {
        console.warn("Manual sync failed for:", mood.id);
      }
    }
  };

  const filteredMoods = useMemo(() => {
    return moods.filter((m) => {
      const matchesMood =
        filter.mood === "All" ||
        m.mood.toLowerCase() === filter.mood.toLowerCase();

      const matchesDate =
        filter.days === 0 ||
        (new Date() - new Date(m.date)) / (1000 * 60 * 60 * 24) <= filter.days;

      return matchesMood && matchesDate;
    });
  }, [moods, filter]);

  const value = useMemo(
    () => ({
      moods,
      filteredMoods,
      addMood,
      deleteMood,
      updateMood,
      shouldRemind,
      syncAll,
      filter,
      setFilter,
      loading,
    }),
    [moods, filteredMoods, shouldRemind, filter, loading]
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}
