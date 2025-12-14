import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";


const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="bg-pink-100 border-b border-pink-200 dark:bg-slate-950 dark:border-b dark:border-slate-800">
      <div className="h-12 px-4 flex items-center relative">
        {/* Left: MSSV */}
        <div className="absolute left-4 text-sm text-gray-600 dark:text-slate-400">
            23120207
        </div>

        {/* Center: Title */}
        <h1 className="mx-auto text-lg font-semibold text-gray-700 dark:text-slate-50">
            Movies info
        </h1>

        {/* Right: Icons */}
        <div className="absolute right-4 flex items-center gap-3">
          <Switch checked={isDark} onCheckedChange={toggleTheme} />

          <button
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 transition
                       dark:bg-slate-950 dark:border dark:border-slate-800 dark:text-slate-50"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Moon size={16} className="text-sky-400 hover:text-sky-500" /> : <Sun size={16} className="text-sky-400 hover:text-sky-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
