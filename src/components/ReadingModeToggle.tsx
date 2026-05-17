import { Book, BookOpen } from "lucide-react";
import { ReadingMode } from "../hooks/useReadingMode";

interface ReadingModeToggleProps {
  mode: ReadingMode;
  onChange: (mode: ReadingMode) => void;
}

export function ReadingModeToggle({ mode, onChange }: ReadingModeToggleProps) {
  const options: { value: ReadingMode; label: string; icon: typeof Book }[] = [
    { value: "surah", label: "Surah", icon: Book },
    { value: "juz", label: "Parah", icon: BookOpen },
  ];

  return (
    <div className="inline-flex items-center bg-muted/60 border rounded-full p-1">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              active
                ? "bg-background text-accent shadow-sm"
                : "text-foreground/60 hover:text-foreground"
            }`}
            aria-pressed={active}
          >
            <Icon size={16} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
