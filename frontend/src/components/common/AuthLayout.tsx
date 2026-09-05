import React from 'react';
import { PROJECT_NAME } from '@/src/constants';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 bg-primary-50 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Main Card */}
      <div className="w-full max-w-250 h-full md:h-162.5 max-h-full bg-background rounded-2xl shadow-2xl flex overflow-hidden flex-col md:flex-row">

        {/* Left Side (Primary Background) */}
        <div className="hidden md:flex md:w-1/2 bg-primary p-10 flex-col relative justify-between text-primary-50 overflow-hidden">
          {/* Logo Section */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-primary-50/10 border border-primary-50/20 flex items-center justify-center font-bold text-lg">
              P
            </div>
            <span className="font-semibold text-xl tracking-tight">{PROJECT_NAME}</span>
          </div>

          {/* Illustration & Welcome text */}
          <div className="flex flex-col items-center text-center mt-8 mb-12 relative z-10">
            <div className="w-48 h-32 relative mb-8 flex items-end justify-center">
              <svg viewBox="0 0 200 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="110" rx="80" ry="10" fill="#0b3832" />
                <circle cx="55" cy="65" r="14" fill="#e8cfa6" />
                <path d="M35 110 C35 85, 75 85, 75 110" fill="#1b4d42" />
                <circle cx="145" cy="65" r="14" fill="#e8cfa6" />
                <path d="M125 110 C125 85, 165 85, 165 110" fill="#1b4d42" />
                <circle cx="100" cy="50" r="18" fill="#f5dec3" />
                <path d="M70 110 C70 70, 130 70, 130 110" fill="#133d34" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-primary-100 max-w-sm text-sm leading-relaxed opacity-90">
              {description}
            </p>
          </div>

          {/* Footer Text */}
          <div className="text-xs text-primary-200 relative z-10 opacity-75 font-medium">
            &copy; 2026 {PROJECT_NAME} Inc. All rights reserved.
          </div>

          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--primary-50) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
