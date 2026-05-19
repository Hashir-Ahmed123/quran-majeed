import { useEffect, useState, useCallback } from "react";

export interface LastRead {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  timestamp: string;
}

const STORAGE_KEY = "quran.lastRead";

function read(): LastRead | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LastRead;
  } catch {
    return null;
  }
}

export function useLastRead() {
  const [lastRead, setLastRead] = useState<LastRead | null>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLastRead(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveLastRead = useCallback((entry: Omit<LastRead, "timestamp">) => {
    const value: LastRead = { ...entry, timestamp: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setLastRead(value);
  }, []);

  const clearLastRead = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLastRead(null);
  }, []);

  return { lastRead, saveLastRead, clearLastRead };
}
