"use client";
import {
  ABOUT_CAREER,
  ABOUT_PTO,
  TESTIMONIALS,
} from "@/lib/about";
import AboutPodcastTicker from "@/components/AboutPodcastTicker";
import AboutTestimonials from "@/components/AboutTestimonials";
import DeferredImage from "@/components/DeferredImage";
import { HIRING_LETTER } from "@/lib/letter";

const askAiPrompt =
  "Would Mayank Kinger be a good fit for what I'm building? Review his product design and design engineering work at https://www.kingermayank.com/, explain where he could be most useful, and point out any gaps or questions worth discussing. If you need more context about my project, ask me for a brief description first.";

const askAiLinks = [
  {
    name: "ChatGPT",
    href: `https://chatgpt.com/?${new URLSearchParams({ q: askAiPrompt })}`,
    logo: "/all-logos/chatgpt.png",
  },
  {
    name: "Claude",
    href: `https://claude.ai/new?${new URLSearchParams({ q: askAiPrompt })}`,
    logo: "/all-logos/claude.webp",
  },
  {
    name: "Google",
    href: `https://www.google.com/search?${new URLSearchParams({ udm: "50", q: askAiPrompt })}`,
    logo: null,
  },
];

type AboutContentProps = {
  /**
   * Registers each scrollable section by index. The /about page uses this to
   * drive its side nav; the Work column section leaves it out.
   */
  registerSection?: (index: number, el: HTMLElement | null) => void;
};

/**
 * About page cards, testimonials, and photo sections.
 */
export default function AboutContent({ registerSection }: AboutContentProps) {
  const ref = (i: number) => (el: HTMLElement | null) =>
    registerSection?.(i, el);

  return (
    <div className="aboutFlow">
      <div className="aboutSplit">
        <section className="aboutCard aboutCardPods">
          <h2 className="aboutCardTitle">Podcasts I&apos;m listening to<span className="workBrandDot">.</span></h2>
          <AboutPodcastTicker />
        </section>

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
      </div>

      <section className="aboutLetterFrame" aria-labelledby="about-letter-title">
        <h2 id="about-letter-title" className="aboutLetterTitle">
          {HIRING_LETTER.title}<span className="workBrandDot">.</span>
        </h2>
        <div className="aboutLetterText">
          {HIRING_LETTER.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p className="aboutLetterSignoff">
            {HIRING_LETTER.signoff}
            <br />
            {HIRING_LETTER.signature}
          </p>
        </div>
      </section>

      <div ref={ref(0)} className="aboutCard aboutCardTestimonials aboutTestimonialsWide">
        <AboutTestimonials testimonials={TESTIMONIALS} />
      </div>

      <section className="aboutAskAi" aria-labelledby="about-ask-ai-title">
        <p className="aboutAskAiEyebrow">Need more context?</p>
        <h2 id="about-ask-ai-title" className="aboutAskAiTitle">
          Ask your favorite AI if I&apos;d be a good fit for what you&apos;re building.
        </h2>
        <div className="aboutAskAiLinks">
          {askAiLinks.map(({ name, href, logo }) => (
            <a
              className="aboutAskAiLink"
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${name} about Mayank Kinger (opens in a new tab)`}
            >
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={`aboutAskAiLogo aboutAskAiLogo${name}`} src={logo} alt="" />
              ) : (
                <span className="aboutAskAiGoogleMark" aria-hidden="true">G</span>
              )}
              <span>Ask {name}</span>
            </a>
          ))}
        </div>
      </section>

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
                        <DeferredImage
                          className="aboutPtoMedia"
                          src={photo.src}
                          alt={photo.alt}
                          fetchPriority="low"
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
