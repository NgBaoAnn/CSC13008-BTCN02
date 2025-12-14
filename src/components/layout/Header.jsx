import React from "react";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-pink-100 border-b border-pink-200">
      <div className="h-12 px-4 flex items-center relative">
        {/* Left: MSSV */}
        <div className="absolute left-4 text-sm text-gray-600">
          23120207
        </div>

        {/* Center: Title */}
        <h1 className="mx-auto text-lg font-semibold text-gray-700">
          Movies info
        </h1>

        {/* Right: Icons */}
        <div className="absolute right-4 flex items-center gap-2">
          <button
            className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition"
            title="Light mode"
          >
            <Sun size={14} className="text-gray-700" />
          </button>

          <button
            className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center hover:bg-gray-600 transition"
            title="Dark mode"
          >
            <Moon size={14} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
