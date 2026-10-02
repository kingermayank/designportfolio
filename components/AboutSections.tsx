import { ABOUT_CAREER } from "@/lib/about";
import { HIRING_LETTER } from "@/lib/letter";

export function AboutCareerCard() {
  return (
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
  );
}

export function AboutLetter() {
  return (
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
  );
}
