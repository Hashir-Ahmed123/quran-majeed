import { Link } from "react-router-dom";
import { JuzInfo } from "../data/juzList";

interface JuzCardProps {
  juz: JuzInfo;
}

export function JuzCard({ juz }: JuzCardProps) {
  return (
    <Link to={`/juz/${juz.number}`} className="block group">
      <div className="border rounded-xl overflow-hidden bg-card shadow-elegant hover:shadow-elegant-lg transition-all duration-300 group-hover:border-accent/30">
        <div className="flex items-center p-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
            <span className="font-serif text-lg text-accent font-medium">{juz.number}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Parah {juz.number}</h3>
              <span className="text-sm text-foreground/60">{juz.name}</span>
            </div>
            <p className="text-sm text-foreground/60">Starts: {juz.startSurah}</p>
          </div>
        </div>
        <div className="border-t px-4 py-3 flex justify-between items-center bg-muted/50">
          <div dir="rtl" className="arabic-text text-lg">{juz.arabicName}</div>
          <div className="text-sm text-foreground/60">Juz {juz.number}/30</div>
        </div>
      </div>
    </Link>
  );
}
