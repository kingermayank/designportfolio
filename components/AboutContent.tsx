"use client";
import {
  ABOUT_CAREER,
  ABOUT_ORIGIN,
  ABOUT_PTO,
  TESTIMONIALS,
} from "@/lib/about";
import AboutPodcastTicker from "@/components/AboutPodcastTicker";
import AboutTestimonials from "@/components/AboutTestimonials";
import DeferredImage from "@/components/DeferredImage";
import { HIRING_LETTER } from "@/lib/letter";

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
        <div className="aboutSplitCol">
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

        </div>
      </div>

      <section className="aboutLetterFrame" aria-labelledby="about-letter-title">
        <div className="aboutLetterTop">
          <h2 id="about-letter-title" className="aboutLetterTitle">
            {HIRING_LETTER.title}
          </h2>
          <div className="aboutLetterAddressRow">
            <div className="aboutLetterAddress">
              <span className="aboutLetterAddressLabel">To:</span>
              <p>{HIRING_LETTER.recipient}</p>
            </div>
            <div className="aboutLetterStamp" aria-hidden="true">
              <span className="aboutLetterStampInitials">MK</span>
              <span className="aboutLetterStampCaption">DESIGN · BUILD</span>
            </div>
          </div>
        </div>
        <div className="aboutLetterRule" />
        <div className="aboutLetterText">
          <p className="aboutLetterGreeting">{HIRING_LETTER.greeting}</p>
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
