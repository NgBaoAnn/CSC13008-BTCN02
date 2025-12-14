import React from "react";
import { Home } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-blue-100 border-b border-blue-200 dark:bg-slate-950 dark:border-b dark:border-slate-800">
      <div className="h-12 px-4 flex items-center justify-between">
        {/* Left: Home icon */}
        <button
          className="p-2 rounded hover:bg-blue-200 transition dark:hover:bg-slate-900"
          title="Home"
        >
          <Home size={18} className="cursor-pointer dark:text-slate-50" />
        </button>

        {/* Right: Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="h-8 px-3 rounded border border-gray-300 text-sm bg-white
                       focus:outline-none focus:ring-1 focus:ring-blue-400
                       dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:placeholder-slate-400"
          />

          <button
            className="h-8 px-4 text-sm rounded border border-gray-400 bg-blue-50 cursor-pointer hover:bg-blue-200 transition
                       dark:bg-sky-600 dark:text-slate-50 dark:border-slate-800 dark:hover:bg-sky-500"
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
