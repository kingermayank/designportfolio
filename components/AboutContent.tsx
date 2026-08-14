"use client";

import { useState } from "react";
import {
  ABOUT_CAREER,
  ABOUT_INTRO,
  ABOUT_ORIGIN,
  ABOUT_PTO,
  ABOUT_SECTIONS,
  TESTIMONIALS,
} from "@/lib/about";
import { HIRING_LETTER } from "@/lib/letter";
import AboutPodcastTicker from "@/components/AboutPodcastTicker";
import CurrentlyStatus from "@/components/CurrentlyStatus";
import HiringLetterOverlay from "@/components/HiringLetterOverlay";

type AboutContentProps = {
  /**
   * Registers each scrollable section by index. The /about page uses this to
   * drive its side nav; the Work column section leaves it out.
   */
  registerSection?: (index: number, el: HTMLElement | null) => void;
};

function AboutHeading({ title }: { title: string }) {
  const trimmed = title.trim();
  const base = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
  return (
    <h3 className="csHeading aboutHeading">
      {base}
      <span className="aboutHeadingDot" aria-hidden="true">
        .
      </span>
    </h3>
  );
}

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
  const [originOpen, setOriginOpen] = useState(false);

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
            <p className="aboutCardLede">{ABOUT_INTRO.summary}</p>
          </section>

          <section className="aboutCard aboutCardPods">
            <h2 className="aboutCardTitle">Podcasts I&apos;m listening to</h2>
            <AboutPodcastTicker />
          </section>

          <button
            type="button"
            className={
              "aboutCard aboutCardOrigin" + (originOpen ? " is-open" : "")
            }
            aria-expanded={originOpen}
            onClick={() => setOriginOpen((open) => !open)}
          >
            <span className="aboutCardTitle">{ABOUT_ORIGIN.heading}</span>
            <div className="aboutCardOriginBody">
              {ABOUT_ORIGIN.body.map((p) => (
                <p key={p.slice(0, 32)} className="aboutCardBody">
                  {p}
                </p>
              ))}
            </div>
          </button>
        </div>

        <div className="aboutSplitCol">
          <section className="aboutCard">
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
                    <span className="aboutCareerMark">
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
            onClick={() => setLetterOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={letterOpen}
          >
            <span className="aboutCardTitle">
              Letter to my future hiring manager
            </span>
            <div className="aboutLetterPreview" aria-hidden>
              <p className="aboutLetterGreeting">{HIRING_LETTER.greeting}</p>
              {HIRING_LETTER.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </button>
        </div>
      </div>

      {letterOpen ? (
        <HiringLetterOverlay onClose={() => setLetterOpen(false)} />
      ) : null}

      {ABOUT_SECTIONS.map((sec, i) => (
        <section key={sec.nav} ref={ref(i)} className="csSection aboutSection">
          <AboutHeading title={sec.heading} />
          {sec.body.map((p, k) => (
            <p key={k} className="csBody">
              {p}
            </p>
          ))}
          {sec.principles && (
            <PhilosophyAccordion principles={sec.principles} />
          )}
        </section>
      ))}

      <section
        ref={ref(ABOUT_SECTIONS.length)}
        className="csSection aboutSection"
      >
        <AboutHeading title="In the words of those I've closely worked with." />
        <div className="aboutQuotes">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="aboutQuote">
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="aboutQuoteAvatar" src={t.avatar} alt="" />
                ) : null}
                <span className="aboutQuoteMeta">
                  <span className="aboutQuoteName">{t.name}</span>
                  <span className="aboutQuoteRole">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        ref={ref(ABOUT_SECTIONS.length + 1)}
        className="csSection aboutSection"
      >
        <AboutHeading title="How I recharge when I'm on PTO." />
        <div className="aboutPtoGrid">
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
      </section>
    </div>
  );
}
