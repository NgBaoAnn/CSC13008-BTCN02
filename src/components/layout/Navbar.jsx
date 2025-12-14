import React from "react";
import { Home } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-blue-100 border-b border-blue-200">
      <div className="h-12 px-4 flex items-center justify-between">
        {/* Left: Home icon */}
        <button
          className="p-2 rounded hover:bg-blue-200 transition"
          title="Home"
        >
          <Home size={18} className="text-gray-700" />
        </button>

        {/* Right: Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="h-8 px-3 rounded border border-gray-300 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          />

          <button
            className="h-8 px-4 text-sm rounded border border-gray-400
                       bg-blue-50 hover:bg-blue-200 transition"
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
