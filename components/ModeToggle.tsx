"use client";

type ModeToggleProps = {
  on: boolean;
  onToggle: () => void;
};

/** Bare work/grid switch — off is the editorial view, on is the image grid. */
export default function ModeToggle({ on, onToggle }: ModeToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Grid view"
      className={"modeToggle" + (on ? " on" : "")}
      onClick={onToggle}
    >
      <span className="modeToggleKnob" />
    </button>
  );
}
