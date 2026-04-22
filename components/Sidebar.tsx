"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  LogOut, 
  ChevronLeft, 
  Menu,
  Settings,
  Package
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth(); 

  // 🟢 FIX 1: Auto-close Sidebar on Route Change (Mobile Only)
  useEffect(() => {
    // If screen is small (mobile breakpoint)
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [pathname]); // Runs whenever the URL changes

  // --- HANDLE CLICK OUTSIDE (Mobile Only) ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (window.innerWidth >= 768) return; // Ignore on Desktop

      if (open && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Helper for link styles
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `
      flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative
      ${isActive 
        ? "bg-[var(--surface-hover)] text-[var(--primary)] font-medium shadow-sm" 
        : "text-[var(--foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary)]"
      }
    `;
  };

  return (
    <aside
      ref={sidebarRef}
      className={`
        h-screen flex flex-col z-50
        bg-[var(--glass-bg)] backdrop-blur-xl border-r border-[var(--glass-border)]
        transition-all duration-300 ease-in-out
        ${open ? "w-72 shadow-2xl" : "w-20"} 
      `}
    >
      {/* ... (Header, Nav, Footer sections remain exactly the same) ... */}
      
      {/* Header / Toggle */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[var(--glass-border)]">
        <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
          <div className="p-1.5 bg-[var(--primary)] rounded-lg flex-shrink-0">
            <Package className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-[var(--foreground)] whitespace-nowrap tracking-tight">
            Weyra Shop
          </span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg text-gray-500 hover:bg-[var(--surface-hover)] hover:text-[var(--primary)] transition-colors flex-shrink-0"
        >
          {open ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        
        {/* Dashboard */}
        <Link href="/" className={getLinkClass("/")}>
          <LayoutDashboard size={22} className="min-w-[22px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            Dashboard
          </span>
          {!open && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
              Dashboard
            </div>
          )}
        </Link>

        {/* Cart History */}
        <Link href="/carts" className={getLinkClass("/carts")}>
          <ShoppingCart size={22} className="min-w-[22px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            Cart History
          </span>
          {!open && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
              Cart History
            </div>
          )}
        </Link>

        {/* Settings (Static Button example) */}
         <Link href="/settings" className={getLinkClass("/settings")}>
          <Settings size={22} className="min-w-[22px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            Settings
          </span>
          {!open && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
              Settings
            </div>
          )}
        </Link>

      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--glass-border)]">
        <button 
          onClick={() => signOut()} // 👈 Add onClick handler
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
            hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-500 hover:text-red-500
          `}
        >
          <LogOut size={22} className="min-w-[22px] transition-transform group-hover:-translate-x-1" />
          <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${open ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}