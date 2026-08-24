"use client";

import { useRef, useState } from "react";
import { crimsonPro } from "@/app/fonts";
import {
  ABOUT_CAREER,
  ABOUT_INTRO,
  ABOUT_ORIGIN,
  ABOUT_PHILOSOPHY,
  ABOUT_PTO,
  TESTIMONIALS,
} from "@/lib/about";
import AboutPodcastTicker from "@/components/AboutPodcastTicker";
import AboutTestimonials from "@/components/AboutTestimonials";
import CurrentlyStatus from "@/components/CurrentlyStatus";
import HiringLetterOverlay from "@/components/HiringLetterOverlay";
import { HIRING_LETTER } from "@/lib/letter";

type AboutContentProps = {
  /**
   * Registers each scrollable section by index. The /about page uses this to
   * drive its side nav; the Work column section leaves it out.
   */
  registerSection?: (index: number, el: HTMLElement | null) => void;
};

/** Koto careers–style accordion: numbered rows, chromatic hierarchy, border hover. */
function PhilosophyAccordion({
  principles,
}: {
  principles: { title: string; text: string }[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="aboutPrinciples">
      {principles.map((pr, i) => {
        const index = String(i + 1).padStart(2, "0");
        const isOpen = openId === pr.title;
        const panelId = `philosophy-panel-${index}`;
        const buttonId = `philosophy-trigger-${index}`;

        return (
          <li
            key={pr.title}
            className={`aboutPrinciple${isOpen ? " is-open" : ""}`}
            onClick={() => {
              if (isOpen) setOpenId(null);
            }}
          >
            <button
              id={buttonId}
              type="button"
              className="aboutPrincipleSummary"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : pr.title)}
            >
              <span className="aboutPrincipleIndex">{index}</span>
              <span className="aboutPrincipleTitle">{pr.title}</span>
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
                <p className="aboutPrincipleText">{pr.text}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * About page body — currently line, hero, info cards, then story sections.
 */
export default function AboutContent({ registerSection }: AboutContentProps) {
  const ref = (i: number) => (el: HTMLElement | null) =>
    registerSection?.(i, el);
  const [letterOpen, setLetterOpen] = useState(false);
  // Where the letter should fly out of / back into.
  const [letterOrigin, setLetterOrigin] = useState<DOMRect | null>(null);
  const letterPreviewRef = useRef<HTMLDivElement>(null);

  const openHiringLetter = () => {
    if (letterOpen) return;
    setLetterOrigin(
      letterPreviewRef.current?.getBoundingClientRect() ?? null,
    );
    setLetterOpen(true);
  };

  const closeHiringLetter = () => setLetterOpen(false);

  return (
    <div className="aboutFlow">
      <div className="aboutLedeSection">
        <CurrentlyStatus />
        <figure className="aboutLedePortrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ABOUT_INTRO.hero.src}
            alt={ABOUT_INTRO.hero.alt}
            style={{ aspectRatio: ABOUT_INTRO.hero.ar }}
          />
        </figure>
      </div>

      <div className="aboutSplit">
        <div className="aboutSplitCol">
          <section className="aboutCard">
            <p className="aboutCardLede">{ABOUT_INTRO.summary.replace(/\.$/, "")}<span className="workBrandDot">.</span></p>
          </section>

          <section className="aboutCard aboutCardPods">
            <h2 className="aboutCardTitle">Podcasts I&apos;m listening to<span className="workBrandDot">.</span></h2>
            <AboutPodcastTicker />
          </section>

          <section className="aboutCard aboutCardOrigin">
            <h2 className="aboutCardTitle">{ABOUT_ORIGIN.heading.replace(/\.$/, "")}<span className="workBrandDot">.</span></h2>
            <div className="aboutCardOriginBody">
              {ABOUT_ORIGIN.body.map((p) => (
                <p key={p.slice(0, 32)} className="aboutCardBody">
                  {p}
                </p>
              ))}
            </div>
          </section>
        </div>

        <div className="aboutSplitCol">
          <section className="aboutCard">
            <h2 className="aboutCardTitle">
              Shaped by 7+ years of designing, building, learning, and
              experimenting<span className="workBrandDot">.</span>
            </h2>
            <ul className="aboutCareer">
              {ABOUT_CAREER.map((job) => (
                <li key={job.company}>
                  <a
                    className="aboutCareerRow"
                    href={job.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${job.company}, ${job.title}, ${job.year} (opens LinkedIn)`}
                  >
                    <span
                      className={
                        "aboutCareerMark" +
                        (job.logoFit === "contain" ? " is-contain" : "")
                      }
                    >
                      {job.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={job.logo} alt="" />
                      ) : (
                        <span className="aboutCareerFill" aria-hidden />
                      )}
                    </span>
                    <span className="aboutCareerName">{job.company}</span>
                    <span className="aboutCareerMeta">
                      <span className="aboutCareerCopy">
                        <span className="aboutCareerRole">{job.title}</span>
                        <span className="aboutCareerYear">{job.year}</span>
                      </span>
                      <svg
                        className="aboutCareerArrow"
                        viewBox="0 0 12 12"
                        aria-hidden
                      >
                        <path
                          d="M3.5 8.5 8.5 3.5M4.25 3.5H8.5V7.75"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <button
            type="button"
            className="aboutCard aboutCardLetter"
            onClick={openHiringLetter}
            aria-haspopup="dialog"
            aria-expanded={letterOpen}
          >
            <span className="aboutCardTitle">
              Letter to my future hiring manager<span className="workBrandDot">.</span>
            </span>
            <div className="aboutLetterPreviewStage" aria-hidden>
              <div
                ref={letterPreviewRef}
                className={`aboutLetterPreview ${crimsonPro.className}`}
              >
                <span className="aboutLetterPreviewClip" />
                <div className="aboutLetterPreviewContent">
                  <span className="aboutLetterPreviewGreeting">
                    {HIRING_LETTER.greeting}
                  </span>
                  <div className="aboutLetterPreviewBody">
                    {HIRING_LETTER.body.map((paragraph) => (
                      <span key={paragraph.slice(0, 24)}>{paragraph}</span>
                    ))}
                  </div>
                  <span className="aboutLetterPreviewSignoff">
                    {HIRING_LETTER.signoff}
                    <br />
                    {HIRING_LETTER.signature}
                  </span>
                </div>
              </div>
              <span className="aboutLetterPreviewHint">Open letter</span>
            </div>
          </button>
        </div>
      </div>

      {/* Philosophy left, testimonials right — same 8px gutter as the cards above. */}
      <div className="aboutSplit aboutSplitMid">
        <section className="aboutCard aboutCardPhilosophy">
          <h2 className="aboutCardTitle">{ABOUT_PHILOSOPHY.title.replace(/\.$/, "")}<span className="workBrandDot">.</span></h2>
          <p className="aboutCardBody">{ABOUT_PHILOSOPHY.lede}</p>
          <PhilosophyAccordion principles={ABOUT_PHILOSOPHY.principles} />
        </section>

        <div ref={ref(0)} className="aboutCard aboutCardTestimonials">
          <AboutTestimonials testimonials={TESTIMONIALS} />
        </div>
      </div>

      {letterOpen ? (
        <HiringLetterOverlay
          origin={letterOrigin}
          onClose={closeHiringLetter}
        />
      ) : null}

      <div ref={ref(1)} className="aboutPtoGrid">
          {[0, 1].map((col) => (
            <div className="aboutPtoCol" key={col}>
              {ABOUT_PTO.filter((_, i) => i % 2 === col).map((photo) => {
                const caption =
                  photo.alt && !photo.alt.startsWith("Travel")
                    ? photo.alt
                    : null;
                return (
                  <figure
                    key={photo.src}
                    className={
                      "aboutPtoItem" +
                      (caption ? " aboutPtoItemCaptioned" : "")
                    }
                    style={{ aspectRatio: photo.ar }}
                  >
                    <div className="aboutPtoInner">
                      <div className="aboutPtoMediaWrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="aboutPtoMedia"
                          src={photo.src}
                          alt={photo.alt}
                        />
                      </div>
                      {caption ? (
                        <figcaption className="aboutPtoCaption">
                          {caption}
                        </figcaption>
                      ) : null}
                    </div>
                  </figure>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
}
