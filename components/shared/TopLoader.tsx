"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startLoading = () => {
    clearProgress();
    setLoading(true);
    setProgress(20); // Start at 20% immediately

    let currentProgress = 20;
    intervalRef.current = setInterval(() => {
      // Faster increments
      currentProgress += Math.random() * 20 + 10;
      if (currentProgress >= 85) {
        currentProgress = 85;
        clearProgress();
      }
      setProgress(currentProgress);
    }, 50); // Faster interval
  };

  const completeLoading = () => {
    clearProgress();
    setProgress(100);
    // Quick fade out
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 150);
  };

  // Complete loading when route changes
  useEffect(() => {
    if (loading) {
      completeLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearProgress();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !anchor.download &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const url = new URL(anchor.href);
        if (
          url.pathname !== pathname ||
          url.search !== window.location.search
        ) {
          startLoading();
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-0.75 bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.7)]"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100 ? "width 100ms ease-out" : "width 50ms linear",
        }}
      />
    </div>
  );
}
