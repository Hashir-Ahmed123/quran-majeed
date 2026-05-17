
import { useEffect, useState } from "react";
import { NavigationBar } from "../components/NavigationBar";
import { PageHeader } from "../components/PageHeader";
import { SurahList } from "../components/SurahList";
import { JuzList } from "../components/JuzList";
import { ReadingModeToggle } from "../components/ReadingModeToggle";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SearchBar } from "../components/SearchBar";
import { fetchSurahs } from "../services/quranApi";
import { Surah } from "../types";
import { useNavigate } from "react-router-dom";
import { useReadingMode } from "../hooks/useReadingMode";
import { JUZ_LIST } from "../data/juzList";

export default function SurahsPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [filteredJuzs, setFilteredJuzs] = useState(JUZ_LIST);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mode, setMode } = useReadingMode();

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
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredSurahs(surahs);
      setFilteredJuzs(JUZ_LIST);
      return;
    }

    setFilteredSurahs(
      surahs.filter(
        (s) =>
          s.englishName.toLowerCase().includes(q) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          s.number.toString().includes(q)
      )
    );

    setFilteredJuzs(
      JUZ_LIST.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.startSurah.toLowerCase().includes(q) ||
          j.number.toString().includes(q)
      )
    );
  };

  const handleSelectSuggestion = (id: number | string) => {
    if (mode === "juz") {
      navigate(`/juz/${id}`);
    } else {
      navigate(`/surah/${id}`);
    }
  };

  const searchSuggestions =
    mode === "surah"
      ? surahs.map((surah) => ({
          id: surah.number,
          text: surah.englishName,
          subtext: `${surah.englishNameTranslation} - ${surah.numberOfAyahs} verses`,
        }))
      : JUZ_LIST.map((j) => ({
          id: j.number,
          text: `Parah ${j.number} - ${j.name}`,
          subtext: `Starts: ${j.startSurah}`,
        }));

  return (
    <div className="min-h-screen pattern-bg pb-20 md:pb-0">
      <NavigationBar />

      <main className="container mx-auto px-4 pt-8 pb-20">
        <PageHeader
          title={mode === "surah" ? "Surahs" : "Paras (Juz)"}
          subtitle={
            mode === "surah"
              ? "Browse all 114 surahs of the Holy Quran"
              : "Browse all 30 paras (juz) of the Holy Quran"
          }
          action={<ReadingModeToggle mode={mode} onChange={setMode} />}
        />

        <div className="mb-8 max-w-2xl">
          <SearchBar
            onSearch={handleSearch}
            placeholder={
              mode === "surah"
                ? "Search surahs by name or number..."
                : "Search paras by name or number..."
            }
            suggestions={searchSuggestions}
            onSelectSuggestion={handleSelectSuggestion}
          />
        </div>

        {isLoading && mode === "surah" ? (
          <LoadingSpinner />
        ) : error && mode === "surah" ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : mode === "surah" ? (
          <SurahList surahs={filteredSurahs} />
        ) : (
          <JuzList juzs={filteredJuzs} />
        )}
      </main>
    </div>
  );
}
