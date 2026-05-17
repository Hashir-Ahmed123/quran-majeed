import { useEffect, useState } from "react";

export type ReadingMode = "surah" | "juz";

const STORAGE_KEY = "quran.readingMode";

export function useReadingMode() {
  const [mode, setModeState] = useState<ReadingMode>(() => {
    if (typeof window === "undefined") return "surah";
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "juz" ? "juz" : "surah";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = (m: ReadingMode) => setModeState(m);

  return { mode, setMode };
}
