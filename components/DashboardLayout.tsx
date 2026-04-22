"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
  pageName,
}: {
  children: React.ReactNode;
  pageName: string;
}) {
  return (
    <div className="flex h-screen w-full bg-[var(--background)]">
      
      {/* 
        SIDEBAR WRAPPER
        - Mobile: 'fixed' (Overlay). Sits on top of content. z-50 ensures it's above everything.
        - Desktop (md+): 'static' (Side-by-side). Part of the flex flow.
      */}
      <div className="fixed md:static inset-y-0 left-0 z-50 flex-none h-full shadow-2xl md:shadow-none">
        <Sidebar />
      </div>

      {/* 
        MAIN CONTENT AREA
        - Mobile: 'ml-20' (Margin Left). Pushes content to the right just enough 
          to clear the *collapsed* sidebar (w-20). If sidebar opens, it overlays.
        - Desktop (md+): 'md:ml-0'. No margin needed because sidebar is side-by-side.
      */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden ml-20 md:ml-0 transition-all duration-300">
        
        {/* Sticky Navbar */}
        <Navbar pageName={pageName} />

        {/* Page Content */}
        <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}