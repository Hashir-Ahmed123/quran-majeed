
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";
import { VerseRow } from "../components/VerseRow";
import { AudioPlayer } from "../components/AudioPlayer";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { TranslationSelector } from "../components/TranslationSelector";
import { 
  fetchSurahDetails, 
  getVerseAudioUrl, 
  getSurahAudioUrl 
} from "../services/quranApi";
import { SurahDetails } from "../types";

export default function SurahPage() {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const [searchParams] = useSearchParams();
  const highlightedVerse = searchParams.get("verse");
  
  const [surah, setSurah] = useState<SurahDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translation, setTranslation] = useState("en.sahih");
  const [surahAudioUrl, setSurahAudioUrl] = useState("");
  const [currentVerseAudio, setCurrentVerseAudio] = useState("");
  
  const verseRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const surahId = parseInt(surahNumber || "1");
  
  useEffect(() => {
    const loadSurah = async () => {
      if (!surahNumber) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Load surah details with selected translation
        const data = await fetchSurahDetails(parseInt(surahNumber), translation);
        setSurah(data);
        
        // Set the surah audio URL
        setSurahAudioUrl(getSurahAudioUrl(parseInt(surahNumber)));
        
      } catch (err) {
        console.error("Failed to load surah:", err);
        setError("Failed to load surah. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSurah();
  }, [surahNumber, translation]);
  
  // Scroll to highlighted verse if specified in URL
  useEffect(() => {
    if (highlightedVerse && surah && !isLoading) {
      const verseIndex = parseInt(highlightedVerse) - 1;
      
      if (verseRefs.current[verseIndex]) {
        setTimeout(() => {
          verseRefs.current[verseIndex]?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Highlight the verse
          verseRefs.current[verseIndex]?.classList.add('bg-accent/5');
          setTimeout(() => {
            verseRefs.current[verseIndex]?.classList.remove('bg-accent/5');
          }, 2000);
        }, 500);
      }
    }
  }, [highlightedVerse, surah, isLoading]);
  
  const handleTranslationChange = (translationId: string) => {
    setTranslation(translationId);
  };
  
  const handlePlayVerseAudio = (verseNumber: number) => {
    const audioUrl = getVerseAudioUrl(surahId, verseNumber);
    setCurrentVerseAudio(audioUrl);
  };
  
  return (
    <div className="min-h-screen pattern-bg pb-20 md:pb-0">
      <NavigationBar />
      
      <main className="container mx-auto px-4 pt-8 pb-20">
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
        ) : surah ? (
          <>
            <div className="mb-8">
              <Link 
                to="/surahs" 
                className="inline-flex items-center text-foreground/60 hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Surahs
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-accent/10 h-10 w-10 flex items-center justify-center rounded-full">
                      <span className="text-accent font-medium">{surah.number}</span>
                    </div>
                    <span className="text-sm text-foreground/60">
                      {surah.revelationType} • {surah.numberOfAyahs} verses
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-serif mb-1">{surah.englishName}</h1>
                  <p className="text-foreground/60 mb-2">{surah.englishNameTranslation}</p>
                  <div className="arabic-text text-2xl mt-2">{surah.name}</div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <TranslationSelector 
                    selected={translation} 
                    onSelect={handleTranslationChange} 
                  />
                </div>
              </div>
            </div>
            
            {/* Audio player section */}
            <div className="mb-8">
              <AudioPlayer 
                audioSrc={currentVerseAudio || surahAudioUrl}
                chapter={surah.number}
                name={surah.englishName}
              />
            </div>
            
            {/* Verses section */}
            <div className="bg-white dark:bg-black/20 rounded-xl shadow-elegant">
              {surah.ayahs.map((verse, index) => (
                <div 
                  key={verse.number} 
                  ref={el => (verseRefs.current[index] = el)}
                >
                  <VerseRow 
                    verse={verse} 
                    surahNumber={surah.number} 
                    onPlayAudio={handlePlayVerseAudio}
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
