"use client";

import { useEffect, useState } from "react";
import { ABOUT_INTRO } from "@/lib/about";
import AboutContent from "@/components/AboutContent";
import CaseBack from "@/components/case-hero/CaseBack";
import Rise from "@/components/Rise";

type AboutProps = {
  onClose?: () => void;
};

/**
 * Standalone About page — editorial reading column like case studies,
 * content centered in the shared max-width.
 */
export default function About({ onClose }: AboutProps) {
  const [contentIn, setContentIn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setContentIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="aboutPageRoot">
      <div className="aboutPageScroll">
        {onClose ? (
          <CaseBack label="Back" onClick={onClose} />
        ) : null}

        <div className="aboutPageContent">
          <header className="aboutPageHeader">
            <Rise show={contentIn} delay={40}>
              <h1 className="aboutPageTitle">
                Hey there, I&apos;m Mayank
                <span className="workBrandDot">.</span>
                <a
                  className="aboutPronunciation"
                  href={ABOUT_INTRO.pronunciationHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ABOUT_INTRO.pronunciation}
                </a>
              </h1>
            </Rise>
          </header>

          <div className={"csFade" + (contentIn ? " in" : "")}>
            <AboutContent />
          </div>
        </div>
      </div>
    </div>
  );
}
