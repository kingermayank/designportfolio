"use client";

import { useEffect, useState } from "react";
import AboutContent from "@/components/AboutContent";
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
      <div className="aboutPageScroll">
        {onClose ? (
          <CaseBack label="Back" onClick={onClose} />
        ) : null}

        <div className="aboutPageContent">
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
