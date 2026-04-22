"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check Session on Mount
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Handle Redirects
  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (!session && !isAuthPage) {
      router.replace("/login");
    } else if (session && isAuthPage) {
      router.replace("/");
    }
  }, [session, loading, pathname, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // --- 🔴 THE FIX: STRICT RENDERING ---
  // If loading, show spinner.
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] gap-4">
        <Loader2 className="animate-spin text-[var(--primary)] h-10 w-10" />
        <p className="text-[var(--foreground)] opacity-60 animate-pulse">Initializing App...</p>
      </div>
    );
  }

  // If NOT logged in, and trying to view a protected page (Dashboard), DO NOT render children.
  // Instead, return null (empty screen) while the useEffect above handles the redirect.
  // This prevents the "Flash" of the dashboard.
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  if (!session && !isAuthPage) {
    return null; 
  }

  // If logged in, render the app normally
  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);