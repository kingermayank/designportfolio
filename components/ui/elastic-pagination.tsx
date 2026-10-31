"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import styles from "./elastic-pagination.module.css";

const STEP = 24;
const DOT = 8;

/** Two spring-driven edges stretch towards the next dot and settle together. */
export function ElasticPagination({ count, index, onSelect, label, itemLabel = "slide", overlay = false }: {
  count: number;
  index: number;
  onSelect: (index: number) => void;
  label: string;
  itemLabel?: string;
  overlay?: boolean;
}) {
  const reduce = useReducedMotion();
  const previous = useRef(index);
  const start = useMotionValue(index * STEP);
  const end = useMotionValue(index * STEP);
  const x = useTransform(() => Math.min(start.get(), end.get()));
  const width = useTransform(() => DOT + Math.abs(end.get() - start.get()));

  useEffect(() => {
    const target = index * STEP;
    const forward = index >= previous.current;
    previous.current = index;
    if (reduce) {
      start.set(target);
      end.set(target);
      return;
    }
    const spring = { type: "spring" as const, stiffness: 500, damping: 34, mass: 0.7 };
    const a = animate(start, target, { ...spring, delay: forward ? 0.055 : 0 });
    const b = animate(end, target, { ...spring, delay: forward ? 0 : 0.055 });
    return () => { a.stop(); b.stop(); };
  }, [index, reduce, start, end]);

  if (count < 2) return null;

  return (
    <div className={`${styles.pagination}${overlay ? ` ${styles.overlay}` : ""}`} role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} type="button" className={styles.button}
          aria-label={`Show ${itemLabel} ${i + 1} of ${count}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => onSelect(i)}
          onKeyDown={(event) => {
            let next: number;
            if (event.key === "ArrowRight") next = (i + 1) % count;
            else if (event.key === "ArrowLeft") next = (i - 1 + count) % count;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = count - 1;
            else return;
            event.preventDefault();
            event.stopPropagation();
            onSelect(next);
            const buttons = event.currentTarget.parentElement?.querySelectorAll("button");
            buttons?.[next]?.focus();
          }}>
          <span className={styles.dot} />
        </button>
      ))}
      <motion.span className={styles.active} aria-hidden="true" style={{ x, width }} />
    </div>
  );
}
