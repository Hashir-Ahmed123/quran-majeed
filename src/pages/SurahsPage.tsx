
import { useEffect, useState } from "react";
import { NavigationBar } from "../components/NavigationBar";
import { PageHeader } from "../components/PageHeader";
import { SurahList } from "../components/SurahList";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SearchBar } from "../components/SearchBar";
import { fetchSurahs } from "../services/quranApi";
import { Surah } from "../types";

export default function SurahsPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSurahs();
        setSurahs(data);
        setFilteredSurahs(data);
      } catch (err) {
        console.error("Failed to load surahs:", err);
        setError("Failed to load surahs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahs();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSurahs(surahs);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = surahs.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(lowercaseQuery) ||
        surah.englishNameTranslation.toLowerCase().includes(lowercaseQuery) ||
        surah.number.toString().includes(lowercaseQuery)
    );

    setFilteredSurahs(filtered);
  };

  return (
    <div className="min-h-screen pattern-bg pb-20 md:pb-0">
      <NavigationBar />
      
      <main className="container mx-auto px-4 pt-8 pb-20">
        <PageHeader 
          title="Surahs" 
          subtitle="Browse all 114 surahs of the Holy Quran"
        />
        
        <div className="mb-8 max-w-2xl">
          <SearchBar onSearch={handleSearch} placeholder="Search surahs by name or number..." />
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <SurahList surahs={filteredSurahs} />
        )}
      </main>
    </div>
  );
}
