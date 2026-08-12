"use client";

/**
 * SearchFieldStandalone
 * ---------------------
 * A drop-anywhere copy of the Warpbnb search field. Paste this one file into any React 18+
 * project and render <SearchFieldStandalone />. It has no dependencies beyond React:
 *
 *   - no design-system imports (tokens are inlined as literal values)
 *   - no icon library (the search glyph is inline SVG)
 *   - no CSS file (styles are injected once, scoped under .sfs-*)
 *   - no image assets, so nothing 404s in a new project
 *
 * Fully interactive as-is: hover states, open/active states, three working dropdowns,
 * guest steppers, click-outside and Escape to close.
 *
 * Values below are copied from the production component
 * (design-system/patterns/SearchField + tokens/index.css) so it looks identical.
 */

import React from 'react';

/* ------------------------------------------------------------------ tokens */

const T = {
  surface: '#ffffff',
  surfaceMuted: '#f2f2f2',
  border: 'rgba(217, 217, 217, 1)',
  overlayHover: 'rgba(0, 0, 0, 0.08)',
  textPrimary: '#222222',
  textSecondary: '#717171',
  accent: '#FF0257',
  onAccent: '#ffffff',
  font: "'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif",
};

const CSS = `
.sfs-root { width: 100%; display: flex; justify-content: center; font-family: ${T.font}; }
.sfs-anchor { position: relative; width: 100%; max-width: 851px; }

.sfs-bar {
  width: 100%; height: 64px; box-sizing: border-box;
  background-color: ${T.surface};
  border: 1px solid ${T.border}; border-radius: 40px;
  box-shadow: 0 0 10px ${T.border}, 0 1px 2px rgba(0, 0, 0, 0.08);
  display: flex; align-items: center; overflow: hidden;
  transition: background-color 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.sfs-bar--has-active { background-color: ${T.surfaceMuted}; }

.sfs-section {
  flex: 1; height: 100%; border: none; border-radius: 40px;
  display: flex; flex-direction: column; justify-content: center;
  text-align: left; cursor: pointer; background: transparent;
  font-family: inherit; color: inherit; min-width: 0;
  transition: box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.sfs-section--where, .sfs-section--era { flex: 0.92; }
.sfs-section--where { padding: 0 40px; }
.sfs-section--era, .sfs-section--who { padding: 0 32px; }
.sfs-section:active:not(:disabled) { transform: none; }

/* Open section: white fill lifted above its neighbours. */
.sfs-section--active {
  position: relative; z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 0 0 999px ${T.surface};
}
/* While one section is open, the others sit flush with the grey bar. */
.sfs-bar--has-active .sfs-section:not(.sfs-section--active) {
  box-shadow: inset 0 0 0 999px ${T.surfaceMuted};
}

.sfs-who-zone {
  flex: 1.16; min-width: 0; height: 100%; position: relative;
  display: flex; align-items: center; padding-right: 8px;
  border-radius: 40px;
  transition: box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.sfs-who-zone--hover:not(.sfs-who-zone--active) { box-shadow: inset 0 0 0 999px ${T.overlayHover}; }
.sfs-who-zone--active {
  position: relative; z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 0 0 999px ${T.surface};
}
.sfs-bar--has-active .sfs-who-zone:not(.sfs-who-zone--active) { box-shadow: inset 0 0 0 999px ${T.surfaceMuted}; }
.sfs-bar--has-active .sfs-who-zone--active .sfs-section { box-shadow: none; }

@media (hover: hover) {
  .sfs-section:hover:not(:disabled):not(.sfs-section--active) { box-shadow: inset 0 0 0 999px ${T.overlayHover}; }
  .sfs-section--active:hover:not(:disabled) { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 0 0 999px ${T.surface}; }
  .sfs-who-zone:not(.sfs-who-zone--active) .sfs-section:hover:not(:disabled) { box-shadow: none; }
  .sfs-who-zone--active .sfs-section:hover:not(:disabled) { box-shadow: none; }
}

.sfs-divider { width: 1px; height: 24px; flex-shrink: 0; transition: background-color 0.18s ease; }

.sfs-label { font-size: 12px; line-height: 14px; font-weight: 500; color: ${T.textPrimary}; }
.sfs-value { font-size: 14px; line-height: 18px; font-weight: 400; color: ${T.textSecondary}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sfs-value--selected { font-weight: 500; color: ${T.textPrimary}; }

.sfs-search-btn {
  width: 48px; height: 48px; padding: 0; border: none; border-radius: 3000px;
  background-color: ${T.accent}; color: ${T.onAccent}; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.sfs-search-btn:active:not(:disabled) { transform: scale(0.97); }
.sfs-search-btn:disabled { cursor: not-allowed; opacity: 0.6; }

/* ------------------------------------------------------------ dropdowns */
.sfs-popover {
  position: absolute; top: 76px; z-index: 30; width: 420px; max-width: 100%;
  background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 24px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12); padding: 12px; box-sizing: border-box;
  animation: sfs-pop 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes sfs-pop { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .sfs-popover { animation: none; } }
.sfs-popover--where { left: 0; }
.sfs-popover--era { left: 50%; transform: translateX(-50%); }
.sfs-popover--who { right: 0; }

.sfs-option {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 14px; border: none; background: transparent; border-radius: 14px;
  font-family: inherit; font-size: 14px; line-height: 18px; color: ${T.textPrimary};
  text-align: left; cursor: pointer; transition: background-color 0.15s ease;
}
.sfs-option:hover { background: ${T.surfaceMuted}; }
.sfs-option--selected { background: ${T.surfaceMuted}; font-weight: 600; }
.sfs-option-sub { font-size: 12px; color: ${T.textSecondary}; font-weight: 400; }

.sfs-row { display: flex; align-items: center; justify-content: space-between; padding: 14px; }
.sfs-row + .sfs-row { border-top: 1px solid ${T.border}; }
.sfs-row-title { font-size: 14px; font-weight: 600; color: ${T.textPrimary}; }
.sfs-row-sub { font-size: 12px; color: ${T.textSecondary}; }
.sfs-stepper { display: flex; align-items: center; gap: 12px; }
.sfs-step-btn {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid ${T.border};
  background: transparent; color: ${T.textPrimary}; font-size: 18px; line-height: 1;
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}
.sfs-step-btn:hover:not(:disabled) { border-color: ${T.textPrimary}; }
.sfs-step-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.sfs-step-count { min-width: 20px; text-align: center; font-size: 14px; color: ${T.textPrimary}; }

/* Mobile: stack Theme / Era / Guests instead of a single overflowing pill */
@media (max-width: 720px) {
  .sfs-bar {
    height: auto;
    min-height: 0;
    flex-direction: column;
    align-items: stretch;
    border-radius: 24px;
    overflow: visible;
  }
  .sfs-section,
  .sfs-section--where,
  .sfs-section--era,
  .sfs-section--who {
    flex: none;
    width: 100%;
    min-height: 64px;
    padding: 12px 20px;
    border-radius: 20px;
  }
  .sfs-who-zone {
    flex: none;
    width: 100%;
    min-height: 64px;
    padding: 0 8px 8px 0;
    padding-right: 64px;
    border-radius: 20px;
    position: relative;
  }
  .sfs-who-zone .sfs-section--who {
    flex: 1;
    padding-right: 12px;
  }
  .sfs-divider { width: auto; height: 1px; margin: 0 16px; }
  .sfs-search-btn {
    position: absolute;
    right: 12px;
    bottom: 12px;
  }
  .sfs-popover {
    position: fixed;
    left: 16px !important;
    right: 16px;
    top: auto;
    bottom: 24px;
    width: auto;
    max-width: none;
    max-height: min(70vh, 420px);
    overflow: auto;
    transform: none !important;
  }
  .sfs-popover--where,
  .sfs-popover--era,
  .sfs-popover--who {
    left: 16px;
    right: 16px;
  }
}
`;

/* Inject the stylesheet once per document. */
function useStyles() {
  React.useEffect(() => {
    const id = 'sfs-styles';
    if (document.getElementById(id)) return;
    const tag = document.createElement('style');
    tag.id = id;
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);
}

/* ------------------------------------------------------------------ data */

export interface SearchFieldOption {
  id: string;
  label: string;
  description?: string;
}

const DEFAULT_THEMES: SearchFieldOption[] = [
  { id: 'grandeur', label: 'Grandeur', description: 'Opulent palaces and royal courts' },
  { id: 'mythic', label: 'Mythic', description: 'Legends, gods, and ancient mysteries' },
  { id: 'conflict', label: 'Conflict', description: 'Battlefields and turning points' },
  { id: 'classified', label: 'Classified', description: 'Covert operations and hidden histories' },
  { id: 'sci-fi', label: 'Sci-Fi', description: 'Advanced tech and alien worlds' },
];

const DEFAULT_ERAS: SearchFieldOption[] = [
  { id: 'origins', label: 'Origins', description: 'Before 3000 BCE' },
  { id: 'classical', label: 'Classical', description: '3000 BCE – 1500 CE' },
  { id: 'recent-past', label: 'Recent Past', description: '1500 – 2024' },
  { id: 'future', label: 'Future', description: '2025 and beyond' },
];

type Section = 'where' | 'era' | 'who' | null;

export interface SearchFieldStandaloneProps {
  themes?: SearchFieldOption[];
  eras?: SearchFieldOption[];
  maxGuests?: number;
  onSearch?: (value: {
    theme: SearchFieldOption | null;
    era: SearchFieldOption | null;
    adults: number;
    children: number;
  }) => void;
}

/* ------------------------------------------------------------- component */

export function SearchFieldStandalone({
  themes = DEFAULT_THEMES,
  eras = DEFAULT_ERAS,
  maxGuests = 16,
  onSearch,
}: SearchFieldStandaloneProps = {}) {
  useStyles();

  const [open, setOpen] = React.useState<Section>(null);
  const [hovered, setHovered] = React.useState<Section>(null);
  const [theme, setTheme] = React.useState<SearchFieldOption | null>(null);
  const [era, setEra] = React.useState<SearchFieldOption | null>(null);
  const [adults, setAdults] = React.useState(0);
  const [children, setChildren] = React.useState(0);

  const rootRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const totalGuests = adults + children;
  const guestLabel = totalGuests
    ? `${totalGuests} guest${totalGuests === 1 ? '' : 's'}`
    : 'Add guests';

  // Dividers hide when either neighbouring section is hovered or open.
  const activeOrHovered = open ?? hovered;
  const showDivider1 = activeOrHovered !== 'where' && activeOrHovered !== 'era';
  const showDivider2 = activeOrHovered !== 'era' && activeOrHovered !== 'who';

  const toggle = (section: Exclude<Section, null>) =>
    setOpen((current) => (current === section ? null : section));

  const sectionClass = (section: Exclude<Section, null>) =>
    ['sfs-section', `sfs-section--${section}`, open === section ? 'sfs-section--active' : '']
      .filter(Boolean)
      .join(' ');

  const renderValue = (text: string, selected: boolean) => (
    <span className={selected ? 'sfs-value sfs-value--selected' : 'sfs-value'}>{text}</span>
  );

  return (
    <div className="sfs-root">
      <div className="sfs-anchor" ref={rootRef}>
        <div className={`sfs-bar${open ? ' sfs-bar--has-active' : ''}`}>
          <button
            type="button"
            className={sectionClass('where')}
            onClick={() => toggle('where')}
            onMouseEnter={() => setHovered('where')}
            onMouseLeave={() => setHovered(null)}
            aria-expanded={open === 'where'}
          >
            <span className="sfs-label">Theme</span>
            {renderValue(theme?.label ?? 'Select theme', !!theme)}
          </button>

          <div
            className="sfs-divider"
            style={{ backgroundColor: showDivider1 ? T.border : 'transparent' }}
            aria-hidden
          />

          <button
            type="button"
            className={sectionClass('era')}
            onClick={() => toggle('era')}
            onMouseEnter={() => setHovered('era')}
            onMouseLeave={() => setHovered(null)}
            aria-expanded={open === 'era'}
          >
            <span className="sfs-label">Era</span>
            {renderValue(era?.label ?? 'Select timeline', !!era)}
          </button>

          <div
            className="sfs-divider"
            style={{ backgroundColor: showDivider2 ? T.border : 'transparent' }}
            aria-hidden
          />

          <div
            className={[
              'sfs-who-zone',
              activeOrHovered === 'who' ? 'sfs-who-zone--hover' : '',
              open === 'who' ? 'sfs-who-zone--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onMouseEnter={() => setHovered('who')}
            onMouseLeave={() => setHovered(null)}
            role="presentation"
          >
            <button
              type="button"
              className={sectionClass('who')}
              onClick={() => toggle('who')}
              aria-expanded={open === 'who'}
            >
              <span className="sfs-label">Who</span>
              {renderValue(guestLabel, totalGuests > 0)}
            </button>
            <button
              type="button"
              className="sfs-search-btn"
              aria-label="Search"
              onClick={() => {
                setOpen(null);
                onSearch?.({ theme, era, adults, children });
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </div>

        {open === 'where' && (
          <div className="sfs-popover sfs-popover--where" role="listbox" aria-label="Theme">
            {themes.map((option) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={theme?.id === option.id}
                className={`sfs-option${theme?.id === option.id ? ' sfs-option--selected' : ''}`}
                onClick={() => {
                  setTheme(option);
                  setOpen('era');
                }}
              >
                <span>{option.label}</span>
                {option.description && <span className="sfs-option-sub">{option.description}</span>}
              </button>
            ))}
          </div>
        )}

        {open === 'era' && (
          <div className="sfs-popover sfs-popover--era" role="listbox" aria-label="Era">
            {eras.map((option) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={era?.id === option.id}
                className={`sfs-option${era?.id === option.id ? ' sfs-option--selected' : ''}`}
                onClick={() => {
                  setEra(option);
                  setOpen('who');
                }}
              >
                <span>{option.label}</span>
                {option.description && <span className="sfs-option-sub">{option.description}</span>}
              </button>
            ))}
          </div>
        )}

        {open === 'who' && (
          <div className="sfs-popover sfs-popover--who" aria-label="Guests">
            <GuestRow
              title="Adults"
              subtitle="Ages 13 or above"
              value={adults}
              onChange={setAdults}
              min={0}
              max={maxGuests - children}
            />
            <GuestRow
              title="Children"
              subtitle="Ages 2–12"
              value={children}
              onChange={setChildren}
              min={0}
              max={maxGuests - adults}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function GuestRow({
  title,
  subtitle,
  value,
  onChange,
  min,
  max,
}: {
  title: string;
  subtitle: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="sfs-row">
      <div>
        <div className="sfs-row-title">{title}</div>
        <div className="sfs-row-sub">{subtitle}</div>
      </div>
      <div className="sfs-stepper">
        <button
          type="button"
          className="sfs-step-btn"
          aria-label={`Decrease ${title}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          −
        </button>
        <span className="sfs-step-count" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="sfs-step-btn"
          aria-label={`Increase ${title}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default SearchFieldStandalone;
