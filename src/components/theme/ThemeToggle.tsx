import { useState } from "react";
import { getTheme, applyTheme } from "./theme";
import type { Theme } from "./theme";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = getTheme();
    applyTheme(savedTheme);
    return savedTheme;
  });

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
    >
      <div className="relative w-10 h-5 bg-slate-700 rounded-full transition-colors duration-300">
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
            isDark ? "left-5 bg-indigo-500" : "left-0.5 bg-amber-400"
          }`}
        >
          {isDark ? (
            <Moon className="w-2.5 h-2.5 text-white" />
          ) : (
            <Sun className="w-2.5 h-2.5 text-white" />
          )}
        </div>
      </div>
      <span className="text-xs">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
};

export default ThemeToggle;