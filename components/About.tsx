"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ABOUT_INTRO, ABOUT_PTO, ABOUT_SECTIONS, TESTIMONIALS } from "@/lib/about";
import Rise from "@/components/Rise";

export default function About() {
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

  const navItems = [...ABOUT_SECTIONS.map((s) => s.nav), "Words", "PTO"];

  return (
    <div ref={rootRef} className="csRoot">
      <div ref={scrollRef} className="csDetail" onScroll={onScroll}>
        <div className="csDetailInner">
          <div className="csPanel csDetailPanel" style={{ height: rootH }}>
            <div className="csDetailHead">
              <Rise show={contentIn} delay={0}>
                <div className="csDetailTitle aboutGreeting">{ABOUT_INTRO.greeting}</div>
              </Rise>
              <Rise show={contentIn} delay={70}>
                <div className="csDetailMeta mono">{ABOUT_INTRO.pronunciation}</div>
              </Rise>
              <nav className="csNav">
                {navItems.map((nav, i) => (
                  <Rise key={nav} show={contentIn} delay={160 + i * 50}>
                    <div className={"csNavItem" + (i === activeSection ? " on" : "")}>{nav}</div>
                  </Rise>
                ))}
              </nav>
              <div className="csCredits">
                {ABOUT_INTRO.links.map((l, i) => (
                  <Rise key={l.label} show={contentIn} delay={380 + i * 60}>
                    <a className="aboutLink mono" href={l.href} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  </Rise>
                ))}
              </div>
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
                  <h3 className="csHeading">{sec.heading}</h3>
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
                <h3 className="csHeading">In the words of those I&rsquo;ve worked closely with.</h3>
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
                <h3 className="csHeading">How I recharge when I&rsquo;m on PTO.</h3>
                <div className="aboutPtoGrid">
                  {ABOUT_PTO.map((photo) => (
                    <figure key={photo.src} className="aboutPtoItem">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        style={{ aspectRatio: photo.ar }}
                      />
                      {photo.alt && !photo.alt.startsWith("Travel") ? (
                        <figcaption className="aboutPtoCaption mono">{photo.alt}</figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </section>

              <section className="csSection aboutOutro">
                <h3 className="csHeading">
                  If my work resonates or simply sparks your curiosity, I&rsquo;d love to chat.
                </h3>
                <a className="aboutCta mono" href="mailto:kingermayank@gmail.com">
                  KINGERMAYANK@GMAIL.COM ↗
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

