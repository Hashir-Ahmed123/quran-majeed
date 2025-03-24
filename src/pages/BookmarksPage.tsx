
import { NavigationBar } from "../components/NavigationBar";
import { PageHeader } from "../components/PageHeader";
import { BookmarkItem } from "../components/BookmarkItem";
import { useBookmarks } from "../hooks/useBookmarks";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="min-h-screen pattern-bg pb-20 md:pb-0">
      <NavigationBar />
      
      <main className="container mx-auto px-4 pt-8 pb-20">
        <PageHeader 
          title="Bookmarks" 
          subtitle="Your saved verses"
        />
        
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkItem
                key={`${bookmark.surahNumber}-${bookmark.verseNumber}`}
                bookmark={bookmark}
                onRemove={removeBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/50 dark:bg-black/10 rounded-xl shadow-elegant">
            <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
            <p className="text-foreground/60 mb-4">
              Save verses while reading to access them quickly
            </p>
            <Link
              to="/surahs"
              className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              <BookOpen size={18} />
              Browse Surahs
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
