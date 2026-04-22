"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, UserPlus, Package } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Optionally handle email verification hint here
      router.push("/"); // Or to a "Check email" page
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
       {/* Background Blobs */}
       <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
       <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md p-8 rounded-3xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-2xl z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-[var(--primary)] rounded-2xl mb-4 shadow-lg shadow-[var(--primary)]/20">
            <Package className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Create Account</h1>
          <p className="text-sm text-[var(--foreground)] opacity-60">Join the admin console today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] opacity-70 uppercase mb-2 ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] opacity-70 uppercase mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              placeholder="Min 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-light)] active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--foreground)] opacity-70">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--primary)] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}