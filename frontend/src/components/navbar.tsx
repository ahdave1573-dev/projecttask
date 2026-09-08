"use client";

import { useAuth } from '@/src/contexts/authcontext';
import { useApp } from '@/src/contexts/appcontext';
import { PROJECT_NAME } from '@/src/constants';
import { Menu, Search } from 'lucide-react';
import { Button } from './common/button';

export default function Navbar() {
  const { userInitials, userFullName } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen, searchQuery, setSearchQuery } = useApp();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background border-b border-primary-200/50">
      {/* Left: Logo and Project Name */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden -ml-2 text-foreground/70 hover:text-foreground hover:bg-neutral-100"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-lg text-primary-50 shadow-sm">
          PT
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground hidden md:block">{PROJECT_NAME}</span>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-foreground/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-primary-50 border-none rounded-xl text-[14px] focus:ring-1 focus:ring-primary outline-none text-foreground placeholder:text-foreground/40"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-[14px]">
            {userInitials}
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-[14px] font-medium text-foreground">{userFullName}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}