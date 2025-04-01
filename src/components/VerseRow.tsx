
import { useState } from "react";
import { BookmarkPlus, BookmarkCheck, Play } from "lucide-react";
import { useBookmarks } from "../hooks/useBookmarks";
import { Verse } from "../types";
import { getVerseAudioUrl } from "../services/quranApi";
import { AudioPlayer } from "./AudioPlayer";

interface VerseRowProps {
  verse: Verse;
  surahNumber: number;
}

export function VerseRow({ verse, surahNumber }: VerseRowProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const isVerseBookmarked = isBookmarked(surahNumber, verse.number);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
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

  const audioUrl = getVerseAudioUrl(surahNumber, verse.number);

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
            onClick={() => setIsPlaying(true)}
            className="p-1.5 rounded-full text-foreground/40 hover:text-foreground/80 transition-colors"
            aria-label="Play verse audio"
          >
            <Play size={18} />
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
      
      <div dir="rtl" className="arabic-text text-2xl mb-4 leading-loose">
        {verse.text}
      </div>
      
      <div className="text-foreground/80 text-base leading-relaxed">
        {verse.translation.text}
      </div>
      
      {isPlaying && (
        <div className="mt-4">
          <AudioPlayer 
            audioSrc={audioUrl}
            chapter={surahNumber}
            name={`Verse ${verse.number}`}
            isPlaying={true}
            onPlayStateChange={(playing) => setIsPlaying(playing)}
            onClose={() => setIsPlaying(false)}
          />
        </div>
      )}
    </div>
  );
}
