"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PageLoader from '../anim/PageLoader';

interface LoaderContextType {
  showLoader: (durationMs?: number) => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const showLoader = useCallback((durationMs = 1500) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, durationMs);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {isLoading && <PageLoader delay={0} />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
}
