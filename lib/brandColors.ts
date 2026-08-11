/**
 * Canonical brand accents for each case-study project.
 * Sampled from the owner's palette (top → bottom):
 * Ikon → WarpBnB → PathAI → BigBasket → Walkity.
 */
export const BRAND_COLORS = {
  /** Ikon Technologies — Toolbox + Ikon PM */
  ikon: "#03BB7D",
  toolbox: "#03BB7D",
  "ikon-pm": "#03BB7D",

  /** WarpBnB */
  warpbnb: "#FF0459",

  /** PathAI */
  pathai: "#D18BFF",

  /** BigBasket */
  bigbasket: "#6DE96C",

  /** Walkity */
  walkity: "#00DFA8",
} as const;

export type BrandColorSlug = keyof typeof BRAND_COLORS;

export function brandColor(slug: string): string | undefined {
  return BRAND_COLORS[slug as BrandColorSlug];
}
