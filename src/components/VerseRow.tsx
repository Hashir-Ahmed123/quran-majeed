
import { useState } from "react";
import { BookmarkPlus, BookmarkCheck, BookText, ChevronUp } from "lucide-react";
import { useBookmarks } from "../hooks/useBookmarks";
import { useLastRead } from "../hooks/useLastRead";
import { Verse } from "../types";
import { TafsirPanel } from "./TafsirPanel";

interface VerseRowProps {
  verse: Verse;
  surahNumber: number;
  surahName?: string;
}

export function VerseRow({ verse, surahNumber, surahName }: VerseRowProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { saveLastRead } = useLastRead();
  const isVerseBookmarked = isBookmarked(surahNumber, verse.number);
  const [isHovered, setIsHovered] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);

  const toggleBookmark = () => {
    if (isVerseBookmarked) {
      removeBookmark(surahNumber, verse.number);
    } else {
      addBookmark({
        surahNumber,
        verseNumber: verse.number,
        text: verse.text,
        translation: verse.translation.text,
        timestamp: new Date().toISOString(),
      });
      saveLastRead({
        surahNumber,
        surahName: surahName ?? `Surah ${surahNumber}`,
        verseNumber: verse.number,
      });
    }
  };

  const toggleTafsir = () => {
    setShowTafsir((v) => !v);
    saveLastRead({
      surahNumber,
      surahName: surahName ?? `Surah ${surahNumber}`,
      verseNumber: verse.number,
    });
  };

  return (
    <div
      className="verse-container py-6 px-4 border-b last:border-b-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-shrink-0 bg-accent/10 h-8 w-8 flex items-center justify-center rounded-full mr-3">
          <span className="text-sm font-medium text-accent">{verse.number}</span>
        </div>

        <div className={`flex space-x-2 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`}>
          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded-full transition-colors ${
              isVerseBookmarked ? "text-accent" : "text-foreground/40 hover:text-foreground/80"
            }`}
            aria-label={isVerseBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isVerseBookmarked ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
          </button>
        </div>
      </div>

      <div dir="rtl" className="arabic-text text-2xl mb-4 leading-loose">
        {verse.text}
      </div>

      <div className="text-foreground/80 text-base leading-relaxed">
        {verse.translation.text}
      </div>

      <div className="mt-4 flex items-center">
        <button
          onClick={toggleTafsir}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 px-3 py-1.5 rounded-full transition-colors"
          aria-expanded={showTafsir}
        >
          {showTafsir ? <ChevronUp size={14} /> : <BookText size={14} />}
          {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
        </button>
      </div>

      {showTafsir && (
        <TafsirPanel surahNumber={surahNumber} ayahNumber={verse.number} />
      )}
    </div>
  );
}
