
import { SurahCard } from "./SurahCard";
import { Surah } from "../types";

interface SurahListProps {
  surahs: Surah[];
  isLoading?: boolean;
}

export function SurahList({ surahs, isLoading }: SurahListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-xl p-4 h-32 animate-pulse bg-muted/50"></div>
        ))}
      </div>
    );
  }

  if (!surahs.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No surahs found</h3>
        <p className="text-foreground/60 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {surahs.map((surah) => (
        <SurahCard key={surah.number} surah={surah} />
      ))}
    </div>
  );
}
