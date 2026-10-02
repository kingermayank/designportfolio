"use client";

import { useEffect, useState } from "react";
import AboutContent from "@/components/AboutContent";
import AboutPhilosophy from "@/components/AboutPhilosophy";
import { AboutCareerCard, AboutLetter } from "@/components/AboutSections";
import CaseBack from "@/components/case-hero/CaseBack";
import Rise from "@/components/Rise";
import { ABOUT_INTRO } from "@/lib/about";

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
      {onClose ? (
        <CaseBack label="Back" onClick={onClose} />
      ) : null}
      <div className="aboutPageScroll">
        <div className="aboutPageContent">
          <div className="aboutPageIntro">
            <figure className={"aboutLedePortrait csFade" + (contentIn ? " in" : "")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ABOUT_INTRO.hero.src}
                alt={ABOUT_INTRO.hero.alt}
                width={904}
                height={1024}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </figure>

            <header className="aboutPageHeader">
              <Rise show={contentIn} delay={40}>
                <h1 className="aboutPageTitle">
                  About me
                  <span className="workBrandDot">.</span>
                </h1>
                <p className="aboutPageSummary">
                  {ABOUT_INTRO.summary.replace(/\.$/, "")}
                  <span className="workBrandDot">.</span>
                </p>
                <p className="aboutPageSummary">{ABOUT_INTRO.currentWork}</p>
                <p className="aboutPageSummary">{ABOUT_INTRO.background}</p>
              </Rise>
            </header>
          </div>

          <div className={"csFade" + (contentIn ? " in" : "")}>
            <AboutCareerCard />
            <AboutLetter />
            <AboutPhilosophy />
            <AboutContent />
          </div>
        </div>

      </div>
    </div>
  );
}
