"use client";

import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { Sun, Moon, LogOut, User, Settings, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ pageName }: { pageName: string }) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  // Extract a display name from the email (e.g., "admin" from "admin@example.com")
  const displayName = user?.email ? user.email.split('@')[0] : "Admin User";

  return (
    <header className="sticky top-0 z-40 w-full h-20 px-4 md:px-8 flex items-center justify-between transition-all duration-300 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md">
      
      {/* --- Page Title --- */}
      <div className="flex flex-col min-w-0 mr-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)] truncate">
          {pageName}
        </h1>
        <span className="text-[10px] md:text-xs font-medium text-[var(--primary)] uppercase tracking-wider opacity-80 truncate">
          Admin Console
        </span>
      </div>

      {/* --- Right Actions --- */}
      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="relative p-2 md:p-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-all duration-300 hover:shadow-[0_0_15px_-3px_var(--primary)] group"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-90" />
          ) : (
            <Moon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-rotate-12" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative group h-full flex items-center">
          
          {/* Avatar Trigger */}
          <button className="flex items-center gap-3 focus:outline-none">
            <div className="relative p-0.5 rounded-full border-2 border-[var(--primary)] transition-transform duration-300 group-hover:scale-105 shadow-sm">
              <Image
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                width={36}
                height={36}
                alt="avatar"
                unoptimized={true}
                className="rounded-full bg-[var(--surface)]"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--primary)] border-2 border-[var(--background)] rounded-full"></div>
            </div>
            
            {/* Hidden on mobile to save space */}
            <div className="hidden lg:flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-[var(--foreground)] max-w-[100px] truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">View Profile</span>
            </div>
            
            <ChevronDown className="hidden md:block w-4 h-4 text-gray-400 group-hover:text-[var(--primary)] transition-colors duration-300" />
          </button>

          {/* Invisible Bridge (Prevents menu closing when moving mouse) */}
          <div className="absolute top-full right-0 w-full h-4 bg-transparent"></div>

          {/* Dropdown Menu */}
          <div className="absolute top-[calc(100%+0.5rem)] right-0 w-64 p-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)] shadow-2xl backdrop-blur-xl origin-top-right transform transition-all duration-300 opacity-0 translate-y-2 invisible pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto z-50">
            
            {/* Header inside dropdown */}
            <div className="px-4 py-3 border-b border-[var(--glass-border)] mb-2">
              <p className="text-sm font-bold text-[var(--foreground)]">My Account</p>
              <p className="text-xs text-gray-500 truncate" title={user?.email}>
                {user?.email || "No Email"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              <Link href="/profile"><MenuItem icon={<User size={16} />} label="My Profile" /></Link>
              <Link href="/settings"><MenuItem icon={<Settings size={16} />} label="Settings" /></Link>
            </div>

            <div className="my-2 border-t border-[var(--glass-border)]"></div>

            {/* Sign Out Button (Connected to AuthContext) */}
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

// Helper component for menu items
function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] rounded-xl hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-all duration-200">
      <span className="opacity-70 group-hover:opacity-100">{icon}</span>
      {label}
    </button>
  );
}