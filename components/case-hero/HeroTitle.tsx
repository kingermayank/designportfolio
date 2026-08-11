"use client";

import { useEffect, useState } from "react";
import Rise from "@/components/Rise";

/**
 * The case-study title, in the same Cesare display face and masked line-rise
 * the case studies and about page already use (see components/Rise.tsx), so
 * every title on the site enters identically.
 *
 * `Rise` only animates when `show` flips false -> true, so the entrance is
 * armed on mount here rather than rendering already-settled.
 */
export default function HeroTitle({ children }: { children: React.ReactNode }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // rAF is paused in a background tab, and the title starts translated out
    // of its mask — so a timer backs it up to guarantee the title appears.
    const raf = requestAnimationFrame(() => setShown(true));
    const timer = setTimeout(() => setShown(true), 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="chTitleWrap">
      <Rise show={shown}>
        <h1 className="chTitle">{children}</h1>
      </Rise>
    </div>
  );
}
