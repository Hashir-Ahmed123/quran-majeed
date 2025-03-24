
import { useState, useEffect } from 'react';
import { Bookmark } from '../types';
import { toast } from '@/components/ui/use-toast';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Error parsing bookmarks:', e);
        localStorage.removeItem('quran-bookmarks');
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Add a bookmark
  const addBookmark = (bookmark: Bookmark) => {
    // Check if already bookmarked
    if (isBookmarked(bookmark.surahNumber, bookmark.verseNumber)) {
      return;
    }
    
    setBookmarks(prev => [...prev, bookmark]);
    toast({
      title: "Bookmark added",
      description: `Verse ${bookmark.surahNumber}:${bookmark.verseNumber} has been bookmarked.`,
    });
  };

  // Remove a bookmark
  const removeBookmark = (surahNumber: number, verseNumber: number) => {
    setBookmarks(prev => 
      prev.filter(bookmark => 
        !(bookmark.surahNumber === surahNumber && bookmark.verseNumber === verseNumber)
      )
    );
    toast({
      title: "Bookmark removed",
      description: `Verse ${surahNumber}:${verseNumber} has been removed from bookmarks.`,
    });
  };

  // Check if a verse is bookmarked
  const isBookmarked = (surahNumber: number, verseNumber: number): boolean => {
    return bookmarks.some(bookmark => 
      bookmark.surahNumber === surahNumber && bookmark.verseNumber === verseNumber
    );
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  };
}
