"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ABOUT_INTRO, ABOUT_PTO, ABOUT_SECTIONS, TESTIMONIALS } from "@/lib/about";
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
              <p className="aboutLede">{ABOUT_INTRO.summary}</p>

              <figure className="aboutHero">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ABOUT_INTRO.hero.src}
                  alt={ABOUT_INTRO.hero.alt}
                  style={{ aspectRatio: ABOUT_INTRO.hero.ar }}
                />
              </figure>

              {ABOUT_SECTIONS.map((sec, i) => (
                <section
                  key={sec.nav}
                  ref={(el) => {
                    if (el) sectionRefs.current.set(i, el);
                    else sectionRefs.current.delete(i);
                  }}
                  className="csSection"
                >
                  <h3 className="csHeading aboutHeading">{sec.heading}</h3>
                  {sec.body.map((p, k) => (
                    <p key={k} className="csBody">
                      {p}
                    </p>
                  ))}
                  {sec.principles && (
                    <div className="aboutPrinciples">
                      {sec.principles.map((pr) => (
                        <div key={pr.title} className="aboutPrinciple">
                          <div className="aboutPrincipleTitle">{pr.title}</div>
                          <p className="aboutPrincipleText">{pr.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}

              <section
                ref={(el) => {
                  if (el) sectionRefs.current.set(ABOUT_SECTIONS.length, el);
                  else sectionRefs.current.delete(ABOUT_SECTIONS.length);
                }}
                className="csSection"
              >
                <h3 className="csHeading aboutHeading">In the words of those I&rsquo;ve worked closely with.</h3>
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
                          <span className="aboutQuoteRole mono">{t.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section
                ref={(el) => {
                  if (el) sectionRefs.current.set(ABOUT_SECTIONS.length + 1, el);
                  else sectionRefs.current.delete(ABOUT_SECTIONS.length + 1);
                }}
                className="csSection"
              >
                <h3 className="csHeading aboutHeading">How I recharge when I&rsquo;m on PTO.</h3>
                <div className="aboutPtoGrid">
                  {ABOUT_PTO.map((photo) => {
                    const caption =
                      photo.alt && !photo.alt.startsWith("Travel")
                        ? photo.alt
                        : null;
                    return (
                      <figure
                        key={photo.src}
                        className={
                          "aboutPtoItem" + (caption ? " aboutPtoItemCaptioned" : "")
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
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
