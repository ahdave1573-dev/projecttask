"use client";

import NewProjectButton from './newprojectbutton';
import ProjectList from './projectlist';
import { useAuth } from '@/src/contexts/authcontext';
import { useApp } from '@/src/contexts/appcontext';
import { useLoader } from '@/src/contexts/loadercontext';
import { X, LogOut, LayoutGrid, Users } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConfirmationModal from '../modal/confirmationmodal';
import { Button } from '../common/button';

export default function Sidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen, setActiveProject, activeProject } = useApp();
  const { showLoader } = useLoader();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 h-full bg-background border-r border-primary-200/50 flex flex-col p-6 overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="mb-6 shrink-0 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => {
                if (pathname !== '/') showLoader(800);
                setActiveProject('');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-[15px] font-semibold rounded-xl transition-colors
                ${pathname === '/'
                  ? 'text-primary-800 bg-primary-50'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
            >
              <LayoutGrid className={`w-5 h-5 ${pathname === '/' ? 'text-primary-700' : 'text-neutral-400'}`} />
              Dashboard
            </Link>

            <Link
              href="/members"
              onClick={() => {
                if (pathname !== '/members') showLoader(800);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 text-[15px] font-semibold rounded-xl transition-colors
                ${pathname === '/members'
                  ? 'text-primary-800 bg-primary-50'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
            >
              <Users className={`w-5 h-5 ${pathname === '/members' ? 'text-primary-700' : 'text-neutral-400'}`} />
              Team Members
            </Link>
          </div>

          <div className="flex items-center justify-between mb-4 shrink-0 px-1">
            <span className="text-[13px] font-bold text-neutral-400 uppercase tracking-wider">
              My Projects
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-neutral-400 hover:text-neutral-600 md:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden space-y-4">
            <div className="shrink-0">
              <NewProjectButton />
            </div>
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <ProjectList />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-6 border-t border-primary-200/50 shrink-0">
          <Button
            variant="ghost"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex! items-center gap-2.5 text-[15px] font-medium text-error-500 hover:text-error-600 p-0! hover:bg-transparent"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Log out"
        description="Are you sure you want to log out of your account?"
        confirmText="Log out"
        type="logout"
      />
    </>
  );
}
