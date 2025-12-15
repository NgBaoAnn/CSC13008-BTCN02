import React from "react";
import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const schema = z.object({
    title: z.string().trim().min(1, "Please enter a keyword"),
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  });

  const onSubmit = (values) => {
    const title = (values?.title || "").trim();
    navigate(`/search?title=${encodeURIComponent(title)}&page=1`);
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Title, Person, Genre ..."
                        className="h-8 w-[180px] text-sm border border-black text-black dark:text-slate-200 dark:border-white dark:bg-slate-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 bg-transparent border border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 dark:text-white dark:border-white dark:hover:bg-slate-500"
              >
                Search
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
