
// Surah list item type
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Single verse type
export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  sajda: boolean;
  translation: {
    text: string;
    edition: {
      language: string;
      name: string;
    }
  }
}

// Detailed surah with verses
export interface SurahDetails {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Verse[];
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  }
}

// Bookmark type
export interface Bookmark {
  surahNumber: number;
  verseNumber: number;
  text: string;
  translation: string;
  timestamp: string;
}
