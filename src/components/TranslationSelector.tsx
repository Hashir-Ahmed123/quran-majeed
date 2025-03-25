
import { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";

const TRANSLATIONS = [
  { id: "en.sahih", name: "Sahih International", language: "English" },
  { id: "en.pickthall", name: "Pickthall", language: "English" },
  { id: "en.yusufali", name: "Yusuf Ali", language: "English" },
  { id: "ur.jalandhry", name: "Jalandhry", language: "Urdu" },
  { id: "ur.ahmedali", name: "Ahmed Ali", language: "Urdu" },
  { id: "fr.hamidullah", name: "Hamidullah", language: "French" },
  { id: "es.cortes", name: "Cortes", language: "Spanish" },
  { id: "de.aburida", name: "Abu Rida", language: "German" }
];

interface TranslationSelectorProps {
  onSelect: (translationId: string) => void;
  selected: string;
}

export function TranslationSelector({ onSelect, selected }: TranslationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedTranslation = TRANSLATIONS.find(t => t.id === selected) || TRANSLATIONS[0];
  
  // Function to get the appropriate icon for each language
  const getLanguageIcon = (language: string) => {
    if (language === "Urdu") {
      return <span className="text-green-600 font-arabic text-xs">پاک</span>;
    }
    return <Globe className="h-3.5 w-3.5" />;
  };
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 px-3 text-sm font-medium text-foreground bg-card border rounded-md hover:bg-muted/50 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <span className="mr-2">
            {getLanguageIcon(selectedTranslation.language)}
          </span>
          <span>{selectedTranslation.name}</span>
        </div>
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1" role="listbox">
            {TRANSLATIONS.map((translation) => (
              <li
                key={translation.id}
                role="option"
                aria-selected={selected === translation.id}
                onClick={() => {
                  onSelect(translation.id);
                  setIsOpen(false);
                }}
                className={`
                  cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm
                  ${selected === translation.id ? "bg-accent/10 text-accent" : "hover:bg-muted/50"}
                `}
              >
                <div className="flex items-center">
                  <span className="mr-2">
                    {getLanguageIcon(translation.language)}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{translation.name}</span>
                    <span className="text-xs text-foreground/60">{translation.language}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
