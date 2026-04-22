"use client";

import { useUser } from "@/hooks/useUser";
import { Mail, Phone, MapPin, Briefcase, User as UserIcon, Calendar, Info } from "lucide-react";

export default function UserProfileBadge({ userId }: { userId: number }) {
  const { data: user, isLoading, error } = useUser(userId);

  // 🔴 SKELETON STATE
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-2 -ml-2 rounded-full cursor-default border border-transparent">
        {/* Circle Skeleton */}
        <div className="w-9 h-9 bg-[var(--surface-hover)] rounded-full animate-pulse" />
        {/* Text Skeletons */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 bg-[var(--surface-hover)] rounded animate-pulse" />
          <div className="h-2 w-16 bg-[var(--surface-hover)] rounded animate-pulse opacity-60" />
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !user) {
    return (
      <div className="flex items-center gap-3 text-[var(--foreground)] opacity-50 p-2 -ml-2 rounded-full">
        <div className="w-9 h-9 bg-[var(--surface)] rounded-full flex items-center justify-center border border-[var(--glass-border)]">
          <UserIcon size={16} />
        </div>
        <span className="text-sm">User #{userId}</span>
      </div>
    );
  }

  // --- Success State ---
  return (
    <div className="relative group inline-block z-30">
      <div className="flex items-center gap-3 cursor-pointer p-2 -ml-2 rounded-full bg-[var(--surface)] border border-[var(--glass-border)] hover:bg-[var(--surface-hover)] transition-all duration-300 group-hover:shadow-md group-hover:border-[var(--primary)]">
        <img 
          src={user.image} 
          alt={user.username} 
          className="w-9 h-9 rounded-full border-2 border-[var(--primary)] object-cover shadow-inner"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-[var(--foreground)]">{user.firstName} {user.lastName}</span>
          <span className="text-xs text-[var(--foreground)] opacity-60">ID: {user.id}</span>
        </div>
        <div className="ml-2 text-[var(--foreground)] opacity-40 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-transform duration-300">
           <Info size={18} />
        </div>
      </div>

      <div className="absolute top-full left-0 w-full h-4 bg-transparent z-40"></div>

      <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-80 bg-[var(--surface)] border border-[var(--glass-border)] rounded-2xl p-5 shadow-2xl backdrop-blur-3xl opacity-0 invisible pointer-events-none transform translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-300 ease-out delay-75">
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[var(--glass-border)]">
          <img src={user.image} alt={user.username} className="w-12 h-12 rounded-full bg-[var(--surface-hover)] shadow-sm border-2 border-[var(--primary)] object-cover" />
          <div>
            <p className="font-bold text-[var(--foreground)] text-lg">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-[var(--foreground)] opacity-60">@{user.username} • {user.age} y/o</p>
          </div>
        </div>
        <div className="space-y-4">
          <InfoRow icon={<Mail size={16} className="text-[var(--primary)]"/>} label="Email" value={user.email} />
          <InfoRow icon={<Phone size={16} className="text-[var(--primary)]"/>} label="Phone" value={user.phone} />
          <InfoRow icon={<Calendar size={16} className="text-[var(--primary)]"/>} label="Birthday" value={new Date(user.birthDate).toLocaleDateString()} />
          <InfoRow icon={<Briefcase size={16} className="text-[var(--primary)]"/>} label="Company" value={`${user.company?.name} (${user.company?.title})`} />
          <InfoRow icon={<MapPin size={16} className="text-[var(--primary)]"/>} label="Address" value={`${user.address?.address}, ${user.address?.city}`} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 text-sm text-[var(--foreground)]">
      <span className="p-2 bg-[var(--background)] border border-[var(--glass-border)] rounded-lg text-[var(--primary)] shadow-sm">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase opacity-50 tracking-wider text-[var(--foreground)]">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}