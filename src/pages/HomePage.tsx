
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SurahList } from "../components/SurahList";
import { fetchSurahs } from "../services/quranApi";
import { Surah } from "../types";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function HomePage() {
  const [featuredSurahs, setFeaturedSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedSurahs = async () => {
      try {
        setIsLoading(true);
        const allSurahs = await fetchSurahs();
        
        // Featured surahs (first 6)
        const featured = allSurahs.slice(0, 6);
        setFeaturedSurahs(featured);
      } catch (err) {
        console.error("Failed to load surahs:", err);
        setError("Failed to load surahs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedSurahs();
  }, []);

  return (
    <div className="min-h-screen pattern-bg pb-20 md:pb-0">
      <main className="container mx-auto px-4 pt-8 pb-20">
        <section className="mb-16 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
            Holy Quran
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-8">
            Read, listen, and study the Holy Quran with translations and audio recitations.
            Find peace and guidance in the words of Allah.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/surahs"
              className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Browse All Surahs
              <ArrowRight size={18} />
            </Link>
            
            <Link
              to="/search"
              className="bg-foreground/5 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-foreground/10 transition-colors"
            >
              Search Verses
            </Link>
          </div>
        </section>
        
        <section>
          <div className="flex flex-col items-center text-center mb-8 gap-2">
            <h2 className="text-2xl font-serif">Featured Surahs</h2>
            <Link
              to="/surahs"
              className="text-accent hover:text-accent/80 font-medium text-sm inline-flex items-center"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
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
          ) : (
            <SurahList surahs={featuredSurahs} />
          )}
        </section>
      </main>
    </div>
  );
}
