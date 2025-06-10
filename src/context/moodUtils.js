export function createMoodEntry(mood, note = "") {
  return {
    id: crypto.randomUUID(),
    mood,
    date: new Date().toISOString().split("T")[0],
    note,
    synced: false,
  };
}

export function simulateApiSync(mood) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      Math.random() < 0.9 ? res() : rej("Random API fail");
    }, 1000);
  });
}
