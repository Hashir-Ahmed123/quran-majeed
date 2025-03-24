
import * as React from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light" | "system";

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState<Theme>("light");

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "light");
  }, []);

  React.useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function setTheme(theme: Theme) {
    setThemeState(theme);
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full p-2 transition-colors hover:bg-accent/10"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-accent" />
      ) : (
        <Sun className="h-5 w-5 text-accent" />
      )}
    </button>
  );
}
