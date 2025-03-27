
import { Surah, Verse, SurahDetails } from "../types";

const API_BASE_URL = "https://api.alquran.cloud/v1";

interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

/**
 * Fetches list of all Surahs
 */
export async function fetchSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    const data: ApiResponse<Surah[]> = await response.json();
    
    if (data.status === 'OK') {
      return data.data;
    }
    throw new Error('Failed to fetch surahs');
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
}

/**
 * Fetches a specific Surah with verses
 */
export async function fetchSurahDetails(surahNumber: number, translation: string = 'en.sahih'): Promise<SurahDetails> {
  try {
    // Fetch the Arabic surah
    const arabicResponse = await fetch(`${API_BASE_URL}/surah/${surahNumber}/ar.alafasy`);
    const arabicData: ApiResponse<SurahDetails> = await arabicResponse.json();
    
    // Fetch the translation
    const translationResponse = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${translation}`);
    const translationData: ApiResponse<SurahDetails> = await translationResponse.json();
    
    if (arabicData.status === 'OK' && translationData.status === 'OK') {
      // Combine Arabic text with translations
      const verses = arabicData.data.ayahs.map((ayah, index) => {
        return {
          ...ayah,
          translation: {
            text: translationData.data.ayahs[index]?.text || '',
            edition: {
              language: translationData.data.edition.language,
              name: translationData.data.edition.name
            }
          }
        };
      });
      
      return {
        ...arabicData.data,
        ayahs: verses
      };
    }
    
    throw new Error('Failed to fetch surah details');
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
}

/**
 * Search for verses by keyword
 */
export async function searchVerses(query: string, limit: number = 20): Promise<Verse[]> {
  try {
    // For demo purposes, this performs a simple search through the first 10 surahs
    // In a real app, you would use a more robust search endpoint
    const results: Verse[] = [];
    
    // Search through first 10 surahs
    for (let i = 1; i <= 10 && results.length < limit; i++) {
      const surah = await fetchSurahDetails(i);
      
      const matchingVerses = surah.ayahs.filter(verse => 
        verse.translation.text.toLowerCase().includes(query.toLowerCase())
      );
      
      results.push(...matchingVerses.slice(0, limit - results.length));
      
      if (results.length >= limit) break;
    }
    
    return results;
  } catch (error) {
    console.error('Error searching verses:', error);
    throw error;
  }
}

/**
 * Get audio URL for a specific verse
 * Using the MP3Quran.net API which is more reliable for individual verse audio
 */
export function getVerseAudioUrl(surahNumber: number, verseNumber: number): string {
  // Try MP3Quran.net with Mishary Rashid Alafasy recitation
  return `https://www.mp3quran.net/api/aya?arabic=quran-uthmani&surah=${surahNumber}&aya=${verseNumber}&recitation=Alafasy`;
}

/**
 * Get audio URL for a complete Surah
 */
export function getSurahAudioUrl(surahNumber: number): string {
  // Using Mishary Rashid Alafasy recitation from quranicaudio.com
  const formattedSurah = surahNumber.toString().padStart(3, '0');
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${formattedSurah}.mp3`;
}
