// Dev only. A corner-smoothing browser extension rewrites rounded elements
// before React hydrates (inline `clip-path: path(…)` plus transparent border
// colors), which React reports as an attribute hydration mismatch on whichever
// element it touched. Swallow that report only when every changed line in the
// diff is one of those injections, so genuine mismatches still surface.

const MISMATCH = "didn't match the client properties";
const INJECTED = /^(clip-path:\s*"path\(|border-(top|right|bottom|left)-color:\s*"transparent"|style=\{\{\s*clip-path:\s*"path\()/;

function isExtensionNoise(args: unknown[]): boolean {
  if (typeof args[0] !== "string" || !args[0].includes(MISMATCH)) return false;
  // args[0] is the explanation (its own "- " bullets aren't diff lines);
  // the component diff arrives in the substitution args after it.
  const text = args.slice(1).filter((a): a is string => typeof a === "string").join("\n");
  const changed = text
    .split("\n")
    .map((line) => line.match(/^\s*[+-]\s+(.*)$/)?.[1]?.trim())
    .filter((line): line is string => !!line);
  return changed.length > 0 && changed.every((line) => INJECTED.test(line));
}

export function ignoreExtensionHydrationNoise() {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;
  type ErrorFn = typeof console.error;
  // Next's overlay hook (and analytics consoles like PostHog) wrap
  // console.error after this runs, each capturing "the previous one" — which
  // is always this getter. Keep the filter outermost and replay the wrappers
  // as a chain: each re-entry steps one wrapper further in, ending at the
  // console.error that existed before any of them.
  const chain: ErrorFn[] = [console.error];
  let depth = 0;
  const filter: ErrorFn = (...args: unknown[]) => {
    if (depth === 0 && isExtensionNoise(args)) return;
    const next = chain[chain.length - 1 - depth] ?? chain[0];
    depth++;
    try {
      next.apply(console, args);
    } finally {
      depth--;
    }
  };
  Object.defineProperty(console, "error", {
    configurable: true,
    get: () => filter,
    set: (fn: ErrorFn) => {
      chain.push(fn);
    },
  });
}
