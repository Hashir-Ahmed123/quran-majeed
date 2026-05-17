import { JuzCard } from "./JuzCard";
import { JuzInfo } from "../data/juzList";

interface JuzListProps {
  juzs: JuzInfo[];
}

export function JuzList({ juzs }: JuzListProps) {
  if (!juzs.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No paras found</h3>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {juzs.map((j) => (
        <JuzCard key={j.number} juz={j} />
      ))}
    </div>
  );
}
