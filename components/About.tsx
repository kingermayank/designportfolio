"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ABOUT_INTRO, ABOUT_SECTIONS } from "@/lib/about";
import AboutContent from "@/components/AboutContent";
import Rise from "@/components/Rise";

type AboutProps = {
  onClose?: () => void;
};

export default function About({ onClose }: AboutProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef(new Map<number, HTMLElement>());
  const [activeSection, setActiveSection] = useState(0);
  const [contentIn, setContentIn] = useState(false);
  const [rootH, setRootH] = useState(600);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setRootH(root.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // Let the view mount before releasing the masked line rises.
  useEffect(() => {
    const id = requestAnimationFrame(() => setContentIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const onScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const center = sc.scrollTop + sc.clientHeight / 2;
    let idx = 0;
    sectionRefs.current.forEach((el, i) => {
      if (el.offsetTop <= center) idx = Math.max(idx, i);
    });
    setActiveSection(idx);
  }, []);

  const scrollToSection = (i: number) => {
    const el = sectionRefs.current.get(i);
    const sc = scrollRef.current;
    if (!el || !sc) return;
    sc.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
  };

  const navItems = [...ABOUT_SECTIONS.map((s) => s.nav), "Words", "PTO"];

  return (
    <div ref={rootRef} className="csRoot">
      <div ref={scrollRef} className="csDetail" onScroll={onScroll}>
        <div className="csDetailInner">
          <div className="csPanel csDetailPanel" style={{ height: rootH }}>
            {onClose ? (
              <Rise show={contentIn} delay={0}>
                <button type="button" className="csBack" onClick={onClose}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M8.5 3.5 4.5 7l4 3.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
              </Rise>
            ) : null}
            <div className="csDetailHead">
              <Rise show={contentIn} delay={40}>
                <div className="csDetailTitle aboutGreeting">
                  Hey there,
                  <br />
                  I&apos;m Mayank<span className="workBrandDot">.</span>
                </div>
              </Rise>
              <Rise show={contentIn} delay={110}>
                <a
                  className="aboutPronunciation"
                  href={ABOUT_INTRO.pronunciationHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ABOUT_INTRO.pronunciation}
                </a>
              </Rise>
              <nav className="csNav" aria-label="About sections">
                {navItems.map((nav, i) => (
                  <Rise key={nav} show={contentIn} delay={200 + i * 50}>
                    <button
                      type="button"
                      className={"csNavItem" + (i === activeSection ? " on" : "")}
                      onClick={() => scrollToSection(i)}
                    >
                      {nav}
                    </button>
                  </Rise>
                ))}
              </nav>
            </div>
          </div>

          <div className="csContent">
            <div className={"csFade" + (contentIn ? " in" : "")}>
              <AboutContent
                registerSection={(i, el) => {
                  if (el) sectionRefs.current.set(i, el);
                  else sectionRefs.current.delete(i);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
