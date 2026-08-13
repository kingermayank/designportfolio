"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type AnimatePresenceProps,
  type Transition,
  type Variants,
} from "framer-motion";
import { Children, useEffect, useState, type ReactNode } from "react";

export type TextLoopProps = {
  children: ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  trigger?: boolean;
  mode?: AnimatePresenceProps["mode"];
};

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
  trigger = true,
  mode = "popLayout",
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (!trigger || items.length <= 1) return;

    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, trigger]);

  const motionVariants: Variants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 },
      };

  return (
    <span
      className={["textLoop", className].filter(Boolean).join(" ")}
    >
      <AnimatePresence mode={mode} initial={false}>
        <motion.span
          key={currentIndex}
          className="textLoopItem"
          initial="initial"
          animate="animate"
          exit="exit"
          transition={reduceMotion ? { duration: 0.15 } : transition}
          variants={reduceMotion ? motionVariants : variants || motionVariants}
        >
          {items[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
