export type CaseHeroBack = {
  /** Visible label and accessible name for the back control. */
  label: string;
  href?: string;
  onClick?: () => void;
};

const BackGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path
      d="M6 3 2 7m0 0 4 4M2 7h10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Labeled back control, fixed to the top-left of the viewport. */
export default function CaseBack({ label, href, onClick }: CaseHeroBack) {
  if (href) {
    return (
      <a className="chBack" href={href} aria-label={label}>
        <BackGlyph />
        <span className="chBackLabel">{label}</span>
      </a>
    );
  }

  return (
    <button
      className="chBack"
      type="button"
      onClick={onClick}
      aria-label={label}
    >
      <BackGlyph />
      <span className="chBackLabel">{label}</span>
    </button>
  );
}
