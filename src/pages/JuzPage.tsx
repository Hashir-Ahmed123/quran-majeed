import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";
import { VerseRow } from "../components/VerseRow";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { TranslationSelector } from "../components/TranslationSelector";
import { fetchJuzDetails } from "../services/quranApi";
import { JUZ_LIST } from "../data/juzList";

interface JuzAyah {
  number: number;
  text: string;
  numberInSurah: number;
  surah: { number: number; englishName: string; name: string };
  translation: { text: string; edition: { language: string; name: string } };
}

export default function JuzPage() {
  const { juzNumber } = useParams<{ juzNumber: string }>();
  const juzId = parseInt(juzNumber || "1");
  const juzInfo = JUZ_LIST.find((j) => j.number === juzId);

  const [ayahs, setAyahs] = useState<JuzAyah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState("en.sahih");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchJuzDetails(juzId, translation);
        setAyahs(data.ayahs as JuzAyah[]);
      } catch (e) {
        console.error(e);
        setError("Failed to load Parah. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [juzId, translation]);

  // Group ayahs by surah for nicer reading
  const groups: { surah: JuzAyah["surah"]; ayahs: JuzAyah[] }[] = [];
  for (const a of ayahs) {
    const last = groups[groups.length - 1];
    if (last && last.surah.number === a.surah.number) {
      last.ayahs.push(a);
    } else {
      groups.push({ surah: a.surah, ayahs: [a] });
    }
  }

  return (
    <div className="min-h-screen pattern-bg pb-20 md:pb-0">
      <NavigationBar />
      <main className="container mx-auto px-4 pt-8 pb-20">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Link to="/surahs" className="inline-flex items-center text-foreground/60 hover:text-foreground transition-colors mb-4">
                <ArrowLeft size={16} className="mr-1" />
                Back
              </Link>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-accent/10 h-10 w-10 flex items-center justify-center rounded-full">
                      <span className="text-accent font-medium">{juzId}</span>
                    </div>
                    <span className="text-sm text-foreground/60">Parah {juzId} of 30 • {ayahs.length} verses</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif mb-1">{juzInfo?.name ?? `Parah ${juzId}`}</h1>
                  <p className="text-foreground/60 mb-2">Starts: {juzInfo?.startSurah}</p>
                  <div dir="rtl" className="arabic-text text-2xl mt-2">{juzInfo?.arabicName}</div>
                </div>
                <div>
                  <TranslationSelector selected={translation} onSelect={setTranslation} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {groups.map((g) => (
                <div key={g.surah.number} className="bg-white dark:bg-black/20 rounded-xl shadow-elegant overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
                    <Link to={`/surah/${g.surah.number}`} className="font-medium hover:text-accent transition-colors">
                      {g.surah.number}. {g.surah.englishName}
                    </Link>
                    <div dir="rtl" className="arabic-text text-xl">{g.surah.name}</div>
                  </div>
                  {g.ayahs.map((a) => (
                    <VerseRow
                      key={a.number}
                      surahNumber={g.surah.number}
                      surahName={g.surah.englishName}
                      verse={{
                        number: a.numberInSurah,
                        text: a.text,
                        numberInSurah: a.numberInSurah,
                        juz: juzId,
                        page: 0,
                        sajda: false,
                        translation: a.translation,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
