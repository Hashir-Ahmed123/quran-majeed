
import { Link } from "react-router-dom";
import type { Surah } from "../types";

interface SurahCardProps {
  surah: Surah;
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link 
      to={`/surah/${surah.number}`}
      className="block group"
    >
      <div className="border rounded-xl overflow-hidden bg-card shadow-elegant hover:shadow-elegant-lg transition-all duration-300 group-hover:border-accent/30">
        <div className="flex items-center p-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
            <span className="font-serif text-lg text-accent font-medium">{surah.number}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">{surah.englishName}</h3>
              <span className="text-sm text-foreground/60">{surah.revelationType}</span>
            </div>
            <p className="text-sm text-foreground/60">{surah.englishNameTranslation}</p>
          </div>
        </div>
        
        <div className="border-t px-4 py-3 flex justify-between items-center bg-muted/50">
          <div className="text-right arabic-text text-lg">{surah.name}</div>
          <div className="text-sm text-foreground/60">{surah.numberOfAyahs} verses</div>
        </div>
      </div>
    </Link>
  );
}
