
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Bookmark } from "../types";
import { formatDate } from "../utils/format";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onRemove: (surahNumber: number, verseNumber: number) => void;
}

export function BookmarkItem({ bookmark, onRemove }: BookmarkItemProps) {
  return (
    <div className="border rounded-lg p-4 bg-card hover:shadow-elegant transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <Link 
          to={`/surah/${bookmark.surahNumber}?verse=${bookmark.verseNumber}`}
          className="text-primary hover:text-accent transition-colors font-medium"
        >
          Surah {bookmark.surahNumber}:{bookmark.verseNumber}
        </Link>
        
        <button
          onClick={() => onRemove(bookmark.surahNumber, bookmark.verseNumber)}
          className="p-1.5 rounded-full text-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Remove bookmark"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="mb-2 text-right arabic-text">
        {bookmark.text.length > 100 ? bookmark.text.substring(0, 100) + "..." : bookmark.text}
      </div>
      
      <p className="text-sm text-foreground/80 mb-2">
        {bookmark.translation.length > 120 ? bookmark.translation.substring(0, 120) + "..." : bookmark.translation}
      </p>
      
      <div className="text-xs text-foreground/60 mt-2">
        Bookmarked {formatDate(bookmark.timestamp)}
      </div>
    </div>
  );
}
