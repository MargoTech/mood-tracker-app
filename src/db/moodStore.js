import { openDB } from "idb";

const DB_NAME = "moodDB";
const STORE_NAME = "moods";
const VERSION = 1;

const dbPromise = openDB(DB_NAME, VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex("date", "date");
      store.createIndex("mood", "mood");
    }
  },
});

export async function getAllMoods() {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}

export async function addMoodToDB(mood) {
  const db = await dbPromise;
  return db.put(STORE_NAME, mood);
}

export async function deleteMoodFromDB(id) {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
}

export async function updateMoodInDB(mood) {
  const db = await dbPromise;
  return db.put(STORE_NAME, mood);
}
