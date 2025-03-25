
import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: Array<{
    id: number | string;
    text: string;
    subtext?: string;
  }>;
  onSelectSuggestion?: (id: number | string) => void;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search for verses...", 
  suggestions = [],
  onSelectSuggestion
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
    setShowSuggestions(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (id: number | string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion) {
      setSearchQuery(suggestion.text);
      onSearch(suggestion.text);
      if (onSelectSuggestion) {
        onSelectSuggestion(id);
      }
    }
    setShowSuggestions(false);
  };
  
  const filteredSuggestions = searchQuery.trim() 
    ? suggestions.filter(s => 
        s.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.subtext && s.subtext.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  
  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-foreground/60" />
          </div>
          
          <Input
            type="search"
            value={searchQuery}
            onChange={handleInputChange}
            className="block w-full pl-10 pr-10 py-3 bg-card border rounded-lg focus:ring-accent focus:border-accent transition-colors"
            placeholder={placeholder}
            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
          />
          
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className="h-4 w-4 text-foreground/60 hover:text-foreground/80" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="md:absolute md:right-0 md:inset-y-0 mt-2 md:mt-0 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg text-sm px-4 py-2 md:rounded-l-none md:rounded-r-lg transition-colors w-full md:w-auto"
        >
          Search
        </button>
      </form>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {filteredSuggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.id)}
                className="px-4 py-2 hover:bg-accent/10 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{suggestion.text}</div>
                  {suggestion.subtext && (
                    <div className="text-sm text-foreground/60">{suggestion.subtext}</div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-foreground/40" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
