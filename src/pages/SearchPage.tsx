
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { NavigationBar } from "../components/NavigationBar";
import { PageHeader } from "../components/PageHeader";
import { SearchBar } from "../components/SearchBar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { searchVerses } from "../services/quranApi";
import { Verse } from "../types";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      
      const results = await searchVerses(query);
      setSearchResults(results);
      
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search verses. Please try again later.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pattern-bg pb-20 md:pb-0">
      <NavigationBar />
      
      <main className="container mx-auto px-4 pt-8 pb-20">
        <PageHeader 
          title="Search Verses" 
          subtitle="Search the Quran for words or phrases"
        />
        
        <div className="max-w-3xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="bg-white dark:bg-black/20 rounded-xl shadow-elegant">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Found {searchResults.length} results</h3>
                </div>
                
                {searchResults.map((verse) => (
                  <div key={verse.number} className="border-b last:border-b-0 p-4 hover:bg-foreground/5 transition-colors">
                    <Link
                      to={`/surah/${verse.juz}?verse=${verse.numberInSurah}`}
                      className="block"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <BookOpen size={16} className="text-accent mt-1" />
                        <span className="font-medium">Surah {verse.juz}, Verse {verse.numberInSurah}</span>
                      </div>
                      
                      <div className="arabic-text text-lg mb-2">{verse.text}</div>
                      <p className="text-sm text-foreground/80">{verse.translation.text}</p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-black/20 rounded-xl shadow-elegant">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-foreground/60">Try different keywords or phrases</p>
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-white/50 dark:bg-black/10 rounded-xl">
              <h3 className="text-xl font-medium mb-2">Begin your search</h3>
              <p className="text-foreground/60">Type a word or phrase above to search the Quran</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
