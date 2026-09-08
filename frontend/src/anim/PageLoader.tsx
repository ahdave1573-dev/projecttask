"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PageLoader({ delay = 250 }: { delay?: number }) {
  const [show, setShow] = useState(delay === 0);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  useEffect(() => {
    if (!show) return;
    
    const dots = dotsRef.current?.children;
    if (!dots) return;

    // Fade and bounce animation for the three dots
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(dots, {
      y: -8,
      opacity: 0.4,
      duration: 0.4,
      stagger: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
      {/* 3 Dots Container */}
      <div ref={dotsRef} className="flex space-x-3">
        <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_5px_var(--primary)]" />
        <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_5px_var(--primary)]" />
        <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_5px_var(--primary)]" />
      </div>
    </div>
  );
}
