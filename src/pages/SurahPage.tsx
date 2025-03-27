
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";
import { VerseRow } from "../components/VerseRow";
import { AudioPlayer } from "../components/AudioPlayer";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { TranslationSelector } from "../components/TranslationSelector";
import { ScrollArea } from "../components/ui/scroll-area";
import { 
  fetchSurahDetails, 
  getVerseAudioUrl, 
  getSurahAudioUrl 
} from "../services/quranApi";
import { SurahDetails, Verse } from "../types";

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
  
  // Audio player state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showFixedPlayer, setShowFixedPlayer] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<number | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  
  const verseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
        
        // Initialize wordRefs with arrays for each verse
        wordRefs.current = new Array(data.ayahs.length);
        for (let i = 0; i < data.ayahs.length; i++) {
          // Approximately split Arabic text into words (this is simplified)
          const wordCount = data.ayahs[i].text.split(' ').length;
          wordRefs.current[i] = new Array(wordCount);
        }
        
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
  
  // Handle word highlighting during audio playback
  useEffect(() => {
    if (!isAudioPlaying || currentVerse === null) {
      // Reset highlighting when not playing
      setActiveWordIndex(-1);
      return;
    }
    
    // Simulated word timing - in a real implementation, this would use timestamps
    const wordTimingInterval = 750; // milliseconds per word
    
    if (currentVerse > 0 && surah) {
      const verseIndex = currentVerse - 1;
      const words = surah.ayahs[verseIndex]?.text.split(' ') || [];
      
      // Set up word highlighting interval
      const interval = setInterval(() => {
        setActiveWordIndex(prev => {
          const nextIndex = prev + 1;
          if (nextIndex >= words.length) {
            clearInterval(interval);
            return -1;
          }
          
          // Scroll the active word into view
          if (wordRefs.current[verseIndex] && wordRefs.current[verseIndex][nextIndex]) {
            wordRefs.current[verseIndex][nextIndex]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
          
          return nextIndex;
        });
      }, wordTimingInterval);
      
      return () => clearInterval(interval);
    }
  }, [isAudioPlaying, currentVerse, surah]);
  
  const handleTranslationChange = (translationId: string) => {
    setTranslation(translationId);
  };
  
  const handlePlayVerseAudio = (verseNumber: number) => {
    const audioUrl = getVerseAudioUrl(surahId, verseNumber);
    setCurrentVerseAudio(audioUrl);
    setCurrentVerse(verseNumber);
    setShowFixedPlayer(true);
    setIsAudioPlaying(true);
    
    // Scroll to the verse being played
    if (verseRefs.current[verseNumber - 1]) {
      verseRefs.current[verseNumber - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const handlePlaybackStateChange = (isPlaying: boolean) => {
    setIsAudioPlaying(isPlaying);
    if (isPlaying) {
      setShowFixedPlayer(true);
    }
  };
  
  const handleClosePlayer = () => {
    setShowFixedPlayer(false);
    setIsAudioPlaying(false);
    setCurrentVerse(null);
    setActiveWordIndex(-1);
  };
  
  const renderVerseText = (verse: Verse, verseIndex: number) => {
    if (!verse.text) return null;
    
    const words = verse.text.split(' ');
    return (
      <div className="arabic-text text-2xl mb-4 leading-loose">
        {words.map((word, wordIndex) => (
          <span
            key={`word-${verseIndex}-${wordIndex}`}
            ref={el => {
              if (wordRefs.current[verseIndex]) {
                wordRefs.current[verseIndex][wordIndex] = el;
              }
            }}
            className={`inline-block mx-1 ${
              currentVerse === verse.number && activeWordIndex === wordIndex
                ? 'border-b-2 border-accent text-accent animate-pulse'
                : ''
            }`}
          >
            {word}
          </span>
        ))}
      </div>
    );
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
            
            {/* Audio player section (non-fixed) */}
            {!showFixedPlayer && (
              <div className="mb-8">
                <AudioPlayer 
                  audioSrc={currentVerseAudio || surahAudioUrl}
                  chapter={surah.number}
                  name={surah.englishName}
                  onPlayStateChange={handlePlaybackStateChange}
                />
              </div>
            )}
            
            {/* Verses section */}
            <div className="bg-white dark:bg-black/20 rounded-xl shadow-elegant" ref={contentRef}>
              {surah.ayahs.map((verse, index) => (
                <div 
                  key={verse.number} 
                  ref={el => (verseRefs.current[index] = el)}
                  className={`verse-container py-6 px-4 border-b last:border-b-0 ${
                    currentVerse === verse.number ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-shrink-0 bg-accent/10 h-8 w-8 flex items-center justify-center rounded-full mr-3">
                      <span className="text-sm font-medium text-accent">{verse.number}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handlePlayVerseAudio(verse.number)}
                        className="p-1.5 rounded-full hover:bg-accent/10 text-accent/80 hover:text-accent transition-colors"
                        aria-label="Play verse audio"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {renderVerseText(verse, index)}
                  
                  <div className="text-foreground/80 text-base leading-relaxed">
                    {verse.translation.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Fixed Audio Player at bottom */}
            {showFixedPlayer && (
              <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
                <div className="pointer-events-auto">
                  <AudioPlayer 
                    audioSrc={currentVerseAudio || surahAudioUrl}
                    chapter={surah.number}
                    name={currentVerse ? `Verse ${currentVerse}` : surah.englishName}
                    isPlaying={isAudioPlaying}
                    onPlayStateChange={handlePlaybackStateChange}
                    onClose={handleClosePlayer}
                    isFixed={true}
                  />
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
