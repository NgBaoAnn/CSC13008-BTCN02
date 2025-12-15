import React from "react";
import { Home, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

        {/* Right: Search + User Area */}
        <div className="flex items-center gap-4">
          {/* Search by title */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem className="relative m-0">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Title, Person, Genre ..."
                      className="h-10 w-[180px] text-sm border border-black text-black dark:text-slate-200 dark:border-white dark:bg-slate-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute bottom-[-25px] left-3 text-red-500" />
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

          {/* User Area */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="default" size="sm" className="h-8 gap-1">
                  <LogIn className="size-3.5" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="sm" className="h-8 gap-1">
                  <UserPlus className="size-3.5" />
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded px-2 py-1 hover:bg-blue-200 dark:hover:bg-slate-900">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt={user?.username || "User"}
                    />
                    <AvatarFallback>
                      {(user?.username || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.username || "User"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate('/favorites')}>Favorites</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="bg-red-300 text-black hover:bg-red-500"
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
