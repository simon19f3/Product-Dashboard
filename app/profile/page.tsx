"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { 
  User, Mail, Phone, MapPin, Save, Loader2, Camera, Check 
} from "lucide-react";
import Image from "next/image";

// Predefined avatar seeds for the picker
const AVATAR_SEEDS = ["Felix", "Aneka", "Zack", "Midnight", "Lilac", "Bandit", "Shadow", "Bear"];

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("Felix");

  // Load initial data from Supabase Auth Metadata
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setFirstName(meta.first_name || "");
      setLastName(meta.last_name || "");
      setPhone(meta.phone || "");
      setAddress(meta.address || "");
      setSelectedAvatar(meta.avatar_seed || "Felix");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Update User Metadata in Supabase Auth (No DB required)
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address: address,
          avatar_seed: selectedAvatar,
        },
      });

      if (error) throw error;
      setMessage({ type: 'success', text: "Profile updated successfully!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout pageName="My Profile">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- Header Card --- */}
        <div className="relative overflow-hidden bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-8 shadow-sm">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-[80px] opacity-10 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Avatar Display */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-[var(--surface)] shadow-xl overflow-hidden bg-[var(--surface-hover)]">
                <Image 
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedAvatar}`}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full border-4 border-[var(--glass-bg)] shadow-md">
                <Camera size={16} />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[var(--foreground)]">
                {firstName || "User"} {lastName}
              </h2>
              <p className="text-[var(--foreground)] opacity-60 flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail size={14} /> {user?.email}
              </p>
              <div className="mt-4 flex gap-2 justify-center md:justify-start">
                 <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider border border-[var(--primary)]/20">
                   Admin
                 </span>
                 <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                   Verified
                 </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Col: Avatar Picker --- */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Choose Avatar</h3>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setSelectedAvatar(seed)}
                    className={`
                      relative rounded-xl overflow-hidden transition-all duration-200 border-2
                      ${selectedAvatar === seed 
                        ? "border-[var(--primary)] scale-110 shadow-md bg-[var(--primary)]/10" 
                        : "border-transparent hover:border-[var(--glass-border)] hover:bg-[var(--surface-hover)] opacity-70 hover:opacity-100"
                      }
                    `}
                  >
                    <Image 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`}
                      alt={seed}
                      width={60}
                      height={60}
                      unoptimized={true}
                    />
                    {selectedAvatar === seed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check size={16} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- Right Col: Info Form --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-6 md:p-8 shadow-sm">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--foreground)]">Personal Information</h3>
                {message && (
                  <span className={`text-sm font-bold px-3 py-1 rounded-lg animate-fade-in
                    ${message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                  `}>
                    {message.text}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--foreground)] opacity-70 uppercase flex items-center gap-2">
                    <User size={14} /> First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                    placeholder="Jane"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--foreground)] opacity-70 uppercase flex items-center gap-2">
                    <User size={14} /> Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                    placeholder="Doe"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--foreground)] opacity-70 uppercase flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-[var(--foreground)] opacity-70 uppercase flex items-center gap-2">
                    <MapPin size={14} /> Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                    placeholder="123 Lime Street, Glass City"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary-light)] active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}