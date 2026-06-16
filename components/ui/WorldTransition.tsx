"use client";

/**
 * WorldTransitionProvider — opens a small portal at the click point and sucks
 * the page's letters, buttons and panels into it, then glitches to the new
 * world. See PortalSuck for the animation engine.
 */

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PortalSuck } from "./PortalSuck";

type Ctx = { enterWorld: (href: string, label?: string, e?: React.MouseEvent) => void };
const WorldTransitionContext = createContext<Ctx>({ enterWorld: () => {} });
export const useWorldTransition = () => useContext(WorldTransitionContext);

export function WorldTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [tx, setTx] = useState<{ x: number; y: number; href: string; key: number } | null>(null);

  const enterWorld = useCallback(
    (href: string, _label = "", e?: React.MouseEvent) => {
      if (busy.current) return;
      if (!contentRef.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      // Always open the hole dead-center of the screen
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      setTx({ x, y, href, key: Date.now() });
    },
    [router]
  );

  return (
    <WorldTransitionContext.Provider value={{ enterWorld }}>
      <div ref={contentRef}>{children}</div>

      {tx && (
        <PortalSuck
          key={tx.key}
          origin={{ x: tx.x, y: tx.y }}
          contentRef={contentRef}
          onNavigate={() => router.push(tx.href)}
          onDone={() => {
            setTx(null);
            busy.current = false;
          }}
        />
      )}
    </WorldTransitionContext.Provider>
  );
}
