
import { Link, useLocation } from "react-router-dom";
import { Book, Bookmark, Home, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function NavigationBar() {
  const location = useLocation();
  
  const links = [
    { path: "/", label: "Home", icon: Home },
    { path: "/surahs", label: "Surahs", icon: Book },
    { path: "/search", label: "Search", icon: Search },
    { path: "/bookmarks", label: "Bookmarks", icon: Bookmark }
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="font-serif text-2xl font-medium text-primary">Quran</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const LinkIcon = link.icon;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2
                  transition-colors
                  ${isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"}
                `}
              >
                <LinkIcon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-40">
        <div className="flex items-center justify-around h-16">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const LinkIcon = link.icon;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex flex-col items-center justify-center px-2 py-1 
                  rounded-md text-xs font-medium transition-colors
                  ${isActive 
                    ? "text-accent" 
                    : "text-foreground/60 hover:text-foreground"}
                `}
              >
                <LinkIcon size={20} className={isActive ? "text-accent" : ""} />
                <span className="mt-1">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
