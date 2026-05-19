// Tafsir API service
// Uses spa5k/tafsir_api (open-source dataset) served via jsDelivr CDN.
// Structured to allow adding more editions later.

export interface TafsirEdition {
  id: string;             // API edition slug
  name: string;           // Display name
  scholar: string;        // Scholar / source name
  language: "en" | "ur" | "ar";
}

export const TAFSIR_EDITIONS: TafsirEdition[] = [
  {
    id: "en-tafisr-ibn-kathir",
    name: "Tafsir Ibn Kathir",
    scholar: "Imam Ismail Ibn Kathir",
    language: "en",
  },
  // Future:
  // { id: "ur-tafseer-bayan-ul-quran", name: "Bayan-ul-Quran", scholar: "Dr. Israr Ahmad", language: "ur" },
  // { id: "ur-tafseer-ibn-e-kaseer", name: "Tafsir Ibn Kathir (Urdu)", scholar: "Imam Ibn Kathir", language: "ur" },
];

export interface TafsirResult {
  edition: TafsirEdition;
  text: string;
  surah: number;
  ayah: number;
}

const BASE = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";

export async function fetchTafsir(
  surah: number,
  ayah: number,
  editionId: string = TAFSIR_EDITIONS[0].id,
): Promise<TafsirResult> {
  const edition = TAFSIR_EDITIONS.find((e) => e.id === editionId) ?? TAFSIR_EDITIONS[0];
  const res = await fetch(`${BASE}/${edition.id}/${surah}/${ayah}.json`);
  if (!res.ok) throw new Error("Failed to load tafsir");
  const data = await res.json();
  return {
    edition,
    text: data.text ?? "",
    surah,
    ayah,
  };
}
