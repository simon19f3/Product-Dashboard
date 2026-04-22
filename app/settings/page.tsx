"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/context/theme-context";
import { 
  Lock, Moon, Sun, Bell, Shield, Loader2, LogOut, Trash2 
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  
  // Password State
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) setMsg(`Error: ${error.message}`);
    else {
      setMsg("Password updated successfully!");
      setNewPassword("");
    }
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <DashboardLayout pageName="Settings">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* --- 1. Appearance Section --- */}
        <section className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--glass-border)] pb-4">
            <Sun className="text-[var(--primary)]" />
            <h3 className="text-xl font-bold text-[var(--foreground)]">Appearance</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--foreground)]">Interface Theme</p>
              <p className="text-sm text-[var(--foreground)] opacity-60">Switch between light and dark mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] hover:bg-[var(--surface-hover)] transition-all"
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="font-medium text-[var(--foreground)]">
                {theme === 'dark' ? "Dark Mode" : "Light Mode"}
              </span>
            </button>
          </div>
        </section>

        {/* --- 2. Security Section (Change Password) --- */}
        <section className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--glass-border)] pb-4">
            <Shield className="text-[var(--primary)]" />
            <h3 className="text-xl font-bold text-[var(--foreground)]">Security</h3>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-[var(--foreground)] opacity-70 uppercase mb-2">New Password</label>
               <input 
                 type="password"
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                 placeholder="Min 6 characters"
                 required
               />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--primary)]">{msg}</span>
                <button
                  type="submit"
                  disabled={loading || !newPassword}
                  className="px-6 py-2.5 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary-light)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                   {loading && <Loader2 className="animate-spin" size={16} />}
                   Update Password
                </button>
             </div>
          </form>
        </section>

        {/* --- 3. Notifications (Mock) --- */}
        <section className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-6 shadow-sm opacity-80">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--glass-border)] pb-4">
            <Bell className="text-[var(--primary)]" />
            <h3 className="text-xl font-bold text-[var(--foreground)]">Notifications</h3>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span>Email Alerts</span>
                <div className="w-12 h-6 bg-[var(--primary)] rounded-full relative cursor-pointer opacity-50"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
             </div>
             <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <div className="w-12 h-6 bg-[var(--surface-hover)] rounded-full relative cursor-pointer border border-[var(--glass-border)]"><div className="absolute left-1 top-1 w-4 h-4 bg-[var(--foreground)] opacity-50 rounded-full"></div></div>
             </div>
          </div>
        </section>

        {/* --- 4. Danger Zone --- */}
        <section className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-sm">
           <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
           <p className="text-sm text-[var(--foreground)] opacity-60 mb-4">Once you delete your account, there is no going back.</p>
           <button className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
             <Trash2 size={16} /> Delete Account
           </button>
        </section>

      </div>
    </DashboardLayout>
  );
}