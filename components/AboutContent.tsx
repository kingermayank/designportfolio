"use client";

import { ABOUT_INTRO, ABOUT_PTO, ABOUT_SECTIONS, TESTIMONIALS } from "@/lib/about";
import CopyEmailButton from "@/components/CopyEmailButton";

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

/**
 * The right-hand column of the About page — lede, hero, story sections,
 * testimonials, PTO. Shared by the standalone /about route and the About Me
 * section in the Work column, so both read from one source.
 */
export default function AboutContent({ registerSection }: AboutContentProps) {
  const ref = (i: number) => (el: HTMLElement | null) =>
    registerSection?.(i, el);

  return (
    <div className="aboutFlow">
      <figure className="aboutHero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ABOUT_INTRO.hero.src}
          alt={ABOUT_INTRO.hero.alt}
          style={{ aspectRatio: ABOUT_INTRO.hero.ar }}
        />
      </figure>

      {/* Lede reads after the portrait, not before it. */}
      <div className="aboutLedeRow">
        <p className="aboutLede">{ABOUT_INTRO.summary}</p>
        <div className="aboutLedeAction">
          <CopyEmailButton
            email={ABOUT_INTRO.email}
            label="Reach Out"
            copiedLabel="Email copied"
            className="aboutCopyEmail"
          />
        </div>
      </div>

      {ABOUT_SECTIONS.map((sec, i) => (
        <section key={sec.nav} ref={ref(i)} className="csSection aboutSection">
          <AboutHeading title={sec.heading} />
          {sec.body.map((p, k) => (
            <p key={k} className="csBody">
              {p}
            </p>
          ))}
          {sec.principles && (
            <div className="aboutPrinciples">
              {sec.principles.map((pr) => (
                <details key={pr.title} className="aboutPrinciple">
                  <summary className="aboutPrincipleSummary">
                    <span className="aboutPrincipleTitle">{pr.title}</span>
                    <span className="aboutPrincipleIcon" aria-hidden="true">
                      <svg
                        className="aboutPrincipleIconPlus"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 3v10M3 8h10"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      <svg
                        className="aboutPrincipleIconMinus"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8h10"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="aboutPrincipleText">{pr.text}</p>
                </details>
              ))}
            </div>
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
