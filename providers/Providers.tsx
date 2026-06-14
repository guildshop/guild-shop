"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";
import { WorldTransitionProvider } from "@/components/ui/WorldTransition";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return (
    <WorldTransitionProvider>
      <AnimatePresence mode="wait" initial={false}>
        <div key={pathname}>{children}</div>
      </AnimatePresence>
    </WorldTransitionProvider>
  );
}
