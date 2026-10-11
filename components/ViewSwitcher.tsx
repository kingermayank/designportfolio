"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOME_VIEWS, type HomeView, type SwitcherView } from "@/lib/homeViews";

// 16px glyphs drawn as miniature wireframes of each layout.
const ICONS: Record<SwitcherView, React.ReactNode> = {
  split: (
    <>
      <rect x="1.5" y="2.5" width="4" height="11" rx="1" />
      <rect x="7.5" y="2.5" width="7" height="5" rx="1" />
      <rect x="7.5" y="9" width="7" height="4.5" rx="1" />
    </>
  ),
  stack: (
    <>
      <path d="M5 3h6" />
      <rect x="2.5" y="5.5" width="11" height="3.5" rx="1" />
      <rect x="2.5" y="10.5" width="11" height="3" rx="1" />
    </>
  ),
};

/** Top-right segmented control that swaps the homepage layout. */
export default function ViewSwitcher({
  view,
  onChange,
}: {
  view: HomeView;
  onChange: (view: HomeView) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="viewSwitcher" role="radiogroup" aria-label="Page layout">
      {HOME_VIEWS.map((v) => {
        const on = v.id === view;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={v.label}
            title={v.label}
            className={"viewSwitcherBtn" + (on ? " on" : "")}
            onClick={() => onChange(v.id)}
          >
            {on && (
              <motion.span
                layoutId="viewSwitcherThumb"
                className="viewSwitcherThumb"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }}
              />
            )}
            <svg viewBox="0 0 16 16" aria-hidden="true">
              {ICONS[v.id]}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
