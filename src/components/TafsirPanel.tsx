import { useEffect, useState } from "react";
import { BookText, Loader2 } from "lucide-react";
import { fetchTafsir, TAFSIR_EDITIONS, TafsirResult } from "../services/tafsirApi";

interface TafsirPanelProps {
  surahNumber: number;
  ayahNumber: number;
}

export function TafsirPanel({ surahNumber, ayahNumber }: TafsirPanelProps) {
  const [editionId, setEditionId] = useState(TAFSIR_EDITIONS[0].id);
  const [tafsir, setTafsir] = useState<TafsirResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTafsir(surahNumber, ayahNumber, editionId);
        if (!cancelled) setTafsir(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Couldn't load tafsir. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [surahNumber, ayahNumber, editionId]);

  return (
    <div className="mt-4 rounded-lg border bg-accent/5 p-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-accent">
          <BookText size={16} />
          <span className="text-sm font-medium">
            {tafsir?.edition.name ?? "Tafsir"}
            {tafsir && (
              <span className="text-foreground/60 font-normal"> — {tafsir.edition.scholar}</span>
            )}
          </span>
        </div>
        {TAFSIR_EDITIONS.length > 1 && (
          <select
            value={editionId}
            onChange={(e) => setEditionId(e.target.value)}
            className="text-xs bg-background border rounded-md px-2 py-1"
          >
            {TAFSIR_EDITIONS.map((ed) => (
              <option key={ed.id} value={ed.id}>
                {ed.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-foreground/60 text-sm py-3">
          <Loader2 size={14} className="animate-spin" /> Loading tafsir…
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : tafsir?.text ? (
        <div
          className="text-foreground/85 text-[15px] leading-relaxed prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: tafsir.text }}
        />
      ) : (
        <p className="text-sm text-foreground/60">No tafsir available for this ayah.</p>
      )}

      <p className="mt-3 text-xs text-foreground/50 italic">
        Different scholars may explain verses differently.
      </p>
    </div>
  );
}
