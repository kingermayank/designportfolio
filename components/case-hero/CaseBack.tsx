export type CaseHeroBack = {
  /** Accessible name for the chevron — it has no visible label. */
  label: string;
  href?: string;
  onClick?: () => void;
};

const BackGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="M8.25 1.5 2.75 6l5.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Chevron-only back control, fixed to the top-left of the viewport. */
export default function CaseBack({ label, href, onClick }: CaseHeroBack) {
  if (href) {
    return (
      <a className="chBack" href={href} aria-label={label}>
        <BackGlyph />
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
    </button>
  );
}
