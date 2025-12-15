import React, { useState } from "react";
import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { isAuthenticated, user, logout } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    navigate(`/search?title=${encodeURIComponent(trimmed)}&page=1`);
  };
  return (
    <nav className="bg-blue-100 border-b border-blue-200 dark:bg-slate-950 dark:border-b dark:border-slate-800">
      <div className="h-12 px-4 flex items-center justify-between">
        {/* Left: Home icon */}
        <Link
          to="/"
          className="p-2 rounded hover:bg-blue-200 transition dark:hover:bg-slate-900"
          title="Home"
        >
          <Home size={18} className="cursor-pointer dark:text-slate-50" />
        </Link>

        {/* Right: Search */}
        <div className="flex items-center gap-4">
          {/* Simple nav links */}
          <div className="flex items-center gap-3 text-sm">
            <Link to="/favorites" className="hover:underline">
              Favorites
            </Link>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
            {!isAuthenticated ? (
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            ) : (
              <>
                <span className="text-xs opacity-80">{user?.username}</span>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="underline"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Search by title */}
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Title, Person, Genre ..."
              className="h-8 w-[180px] text-sm border border-black text-black dark:text-slate-200 dark:border-white dark:bg-slate-800"
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 bg-transparent border border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 dark:text-white dark:border-white dark:hover:bg-slate-500"
            >
              Search
            </Button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
