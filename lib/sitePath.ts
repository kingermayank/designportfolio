// The site is served at two roots: the public site at "/" and a review-only
// copy at REVIEW_BASE (noindex, with the Inflight widget). The app's own code
// keeps working in public paths ("/", "/about", "/work/slug"); these helpers
// add the root when a URL goes out (links, router pushes, history writes) and
// strip it when one comes in (usePathname, location.pathname).

export const REVIEW_BASE = "/dive";

/** The root a pathname lives under: REVIEW_BASE or "" (the public site). */
export function baseOf(pathname: string): string {
  return pathname === REVIEW_BASE || pathname.startsWith(`${REVIEW_BASE}/`) ? REVIEW_BASE : "";
}

/** The current page's root (client only; "" during SSR). */
export function currentBase(): string {
  return typeof window === "undefined" ? "" : baseOf(window.location.pathname);
}

/** Public path → URL under `base` ("/" → "/dive", "/?view=grid" → "/dive?view=grid"). */
export function toSite(path: string, base: string = currentBase()): string {
  if (!base || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === "/") return base;
  if (path.startsWith("/?") || path.startsWith("/#")) return base + path.slice(1);
  return base + path;
}

/** URL pathname → the public path the app reasons about ("/dive/about" → "/about"). */
export function fromSite(pathname: string): string {
  const base = baseOf(pathname);
  if (!base) return pathname;
  return pathname.slice(base.length) || "/";
}
