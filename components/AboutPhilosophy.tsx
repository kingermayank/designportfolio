"use client";

import { useState } from "react";
import { ABOUT_PHILOSOPHY } from "@/lib/about";

export default function AboutPhilosophy() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="aboutPhilosophy" aria-labelledby="about-philosophy-title">
      <h2 id="about-philosophy-title" className="aboutPhilosophyTitle">
        {ABOUT_PHILOSOPHY.title.replace(/\.$/, "")}
        <span className="workBrandDot">.</span>
      </h2>
      <p className="aboutPhilosophyLede">{ABOUT_PHILOSOPHY.lede}</p>

      <ul className="aboutPrinciples">
        {ABOUT_PHILOSOPHY.principles.map((principle, i) => {
          const index = String(i + 1).padStart(2, "0");
          const isOpen = openId === principle.title;
          const panelId = `philosophy-panel-${index}`;
          const buttonId = `philosophy-trigger-${index}`;

          return (
            <li
              key={principle.title}
              className={`aboutPrinciple${isOpen ? " is-open" : ""}`}
            >
              <button
                id={buttonId}
                type="button"
                className="aboutPrincipleSummary"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : principle.title)}
              >
                <span className="aboutPrincipleIndex">{index}</span>
                <span className="aboutPrincipleTitle">{principle.title}</span>
                <span className="aboutPrincipleIcon" aria-hidden="true">
                  <span className="aboutPrincipleIconHit">
                    <span className="aboutPrincipleIconBg" />
                    <svg
                      className="aboutPrincipleIconSvg"
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        className="aboutPrincipleIconV"
                        d="M5 8.41455L5 1.58472"
                        stroke="currentColor"
                        strokeLinecap="square"
                      />
                      <path
                        d="M1.58496 5L8.41479 5"
                        stroke="currentColor"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="aboutPrinciplePanel"
                aria-hidden={!isOpen}
              >
                <div className="aboutPrinciplePanelInner">
                  <p className="aboutPrincipleText">{principle.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
