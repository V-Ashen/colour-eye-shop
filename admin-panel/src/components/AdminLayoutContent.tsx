"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";
import { Hexagon } from "lucide-react";

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#121214] flex items-center justify-between px-4 z-40 border-b border-[#2A2A2E]">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-[#C9A84C] p-1 rounded-md">
            <Hexagon size={16} className="fill-white/20" />
          </div>
          <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>AdminPanel</h1>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="text-white p-2"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block h-full">
        <Sidebar onClose={() => {}} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative w-72 h-full bg-[#121214] flex-shrink-0 animate-in slide-in-from-left duration-200">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 p-1"
            >
              <X size={24} />
            </button>
            <Sidebar onClose={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto mt-16 md:mt-0 relative">
        {children}
      </main>
      
    </div>
  );
}
