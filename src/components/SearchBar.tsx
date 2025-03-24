
import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search for verses..." }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };
  
  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-foreground/60" />
        </div>
        
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-3 bg-card border rounded-lg focus:ring-accent focus:border-accent transition-colors"
          placeholder={placeholder}
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
  );
}
