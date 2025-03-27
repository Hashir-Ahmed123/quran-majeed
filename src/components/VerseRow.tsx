
import { useState } from "react";
import { BookmarkPlus, BookmarkCheck, Play, Volume2 } from "lucide-react";
import { useBookmarks } from "../hooks/useBookmarks";
import { Verse } from "../types";

interface VerseRowProps {
  verse: Verse;
  surahNumber: number;
  onPlayAudio: (verseNumber: number) => void;
}

export function VerseRow({ verse, surahNumber, onPlayAudio }: VerseRowProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const isVerseBookmarked = isBookmarked(surahNumber, verse.number);
  const [isHovered, setIsHovered] = useState(false);
  
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
    }
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
        
        <div className={`flex space-x-2 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <button 
            onClick={() => onPlayAudio(verse.number)}
            className="p-1.5 rounded-full hover:bg-accent/10 text-accent/80 hover:text-accent transition-colors"
            aria-label="Play verse audio"
          >
            <Volume2 size={18} />
          </button>
          
          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded-full transition-colors ${
              isVerseBookmarked 
                ? "text-accent" 
                : "text-foreground/40 hover:text-foreground/80"
            }`}
            aria-label={isVerseBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isVerseBookmarked ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
          </button>
        </div>
      </div>
      
      <div className="arabic-text text-2xl mb-4 leading-loose">
        {verse.text}
      </div>
      
      <div className="text-foreground/80 text-base leading-relaxed">
        {verse.translation.text}
      </div>
    </div>
  );
}
