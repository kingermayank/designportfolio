// Dev only. A corner-smoothing browser extension rewrites rounded elements
// before React hydrates (inline `clip-path: path(…)` plus transparent border
// colors), which React reports as an attribute hydration mismatch on whichever
// element it touched. Swallow that report only when every changed line in the
// diff is one of those injections, so genuine mismatches still surface.

const MISMATCH = "didn't match the client properties";

/** A style property the extension injects (as written in React's diff). */
const injectedProp = (name: string, value: string) =>
  (name === "clip-path" && value.startsWith("path(")) ||
  (/^border-(top|right|bottom|left)-color$/.test(name) && value === "transparent");

// Expanded diff form: one property per line inside a `style={{ … }}` block.
const INJECTED_LINE = /^(clip-path):\s*"(.*)$|^(border-(?:top|right|bottom|left)-color):\s*"([^"]*)"/;

/** `style={undefined}` / `style={{a:"1",b:"2"}}` → property map; null if not a style line. */
function parseStyle(line: string): Map<string, string> | null {
  if (line === "style={undefined}" || line === "style={{}}") return new Map();
  const body = line.match(/^style=\{\{(.*)\}\}$/)?.[1];
  if (body == null) return null;
  const props = new Map<string, string>();
  for (const [, name, value] of body.matchAll(/([a-zA-Z-]+):\s*"((?:[^"\\]|\\.)*)"/g)) {
    props.set(name, value);
  }
  return props;
}

/** Does a server-side style differ from the client's only by injected properties? */
function onlyInjected(server: Map<string, string>, client: Map<string, string>) {
  for (const [name, value] of server) {
    if (injectedProp(name, value)) continue;
    const mine = client.get(name);
    // React truncates long values with "..." — compare the visible prefix.
    const visible = value.endsWith("...") ? value.slice(0, -3) : value;
    if (mine == null || !mine.startsWith(visible)) return false;
  }
  for (const name of client.keys()) if (!server.has(name)) return false;
  return true;
}

// A changed line in React's component diff is JSX: a tag, an attribute, a
// style property inside an expanded `style={{ … }}`, or a brace/quote-wrapped
// value. The explanation's own "- A server/client branch…" bullets are prose,
// so they never match.
const DIFF_LINE = /^(<|\/?>|[\w:.-]+=|[\w-]+:\s*"|\{|")/;

const asText = (a: unknown) => (typeof a === "string" ? a : a instanceof Error ? a.message : "");

export function isExtensionNoise(args: unknown[]): boolean {
  // The diff may come as a substitution arg after the explanation, or (Next
  // 16.2+) already folded into the first argument / an Error's message.
  const text = args.map(asText).join("\n");
  if (!text.includes(MISMATCH)) return false;
  const changed = text
    .split("\n")
    .map((line) => line.match(/^\s*([+-])\s+(.*)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map(([, sign, line]) => ({ sign, line: line.trim() }))
    .filter(({ line }) => DIFF_LINE.test(line));
  if (!changed.length) return false;

  // Compact form: the whole style attribute differs, e.g.
  //   + style={undefined}            (client: no style at all)
  //   - style={{clip-path:"path(…"}} (server HTML, after the extension)
  // Pair client/server style lines in order and compare without injections.
  const client = changed.filter((c) => c.sign === "+" && parseStyle(c.line));
  const server = changed.filter((c) => c.sign === "-" && parseStyle(c.line));
  const paired = new Set<(typeof changed)[number]>();
  if (client.length === server.length) {
    server.forEach((s, k) => {
      if (onlyInjected(parseStyle(s.line)!, parseStyle(client[k].line)!)) {
        paired.add(s);
        paired.add(client[k]);
      }
    });
  }

  const unmatched = changed.filter((c) => {
    if (paired.has(c)) return false;
    const m = c.line.match(INJECTED_LINE);
    // Expanded form: a server-only injected property line.
    return !(c.sign === "-" && m && injectedProp(m[1] ?? m[3], m[2] ?? m[4]));
  });
  if (unmatched.length === 0) return true;
  // The extension was involved but changed something this filter doesn't
  // recognise yet: name it, so the pattern (or a suppression) can be added.
  if (/path\(/.test(text)) {
    console.debug("[hydration] extension mismatch not filtered; unrecognised lines:", unmatched.map((c) => `${c.sign} ${c.line}`));
  }
  return false;
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
