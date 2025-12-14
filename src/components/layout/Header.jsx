import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="bg-pink-100 border-b border-pink-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="h-12 px-4 flex items-center relative">
        {/* Left: MSSV */}
        <div className="absolute left-4 text-sm text-gray-600 dark:text-gray-300">
          23120207
        </div>

        {/* Center: Title */}
        <h1 className="mx-auto text-lg font-semibold text-gray-700 dark:text-gray-100">
          Movies info
        </h1>

        {/* Right: Icons */}
        <div className="absolute right-4 flex items-center">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
