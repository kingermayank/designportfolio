export type Tile = {
  id: number;
  ar: number; // natural aspect ratio, width / height
  shade: string; // fill shown before the thumbnail paints
  name: string; // label shown in the canvas header
  kind: "IMAGE" | "VIDEO";
  w: number; // true pixel dimensions, shown in the header
  h: number;
  thumb: string; // lightweight 900px still (poster / image fallback)
  grid: string; // what the grid plays: 720px loop for video, thumb for stills
  full: string; // original asset, shown when a tile is zoomed
  video: boolean;
  project: string;
};

export type Row = { h: number; tiles: Tile[] };

type Asset = [proj: string, file: string, video: boolean, w: number, h: number];

// Every asset from the three ported case studies. Dimensions measured from the
// files themselves so the grid never distorts or crops anything.
const ASSETS: Asset[] = [
  // — Toolbox (Ikon Technologies)
  ["toolbox", "hero.mp4", true, 3840, 2048],
  ["toolbox", "ai-chat.mp4", true, 3840, 2048],
  ["toolbox", "inventory.mp4", true, 3840, 2048],
  ["toolbox", "configurations.mp4", true, 3840, 2048],
  ["toolbox", "device-pairing.mp4", true, 3840, 2048],
  ["toolbox", "dashboard.mp4", true, 1920, 1080],
  ["toolbox", "invoices.mp4", true, 3840, 2048],
  ["toolbox", "gateways.mp4", true, 3840, 2048],
  ["toolbox", "design-system.mp4", true, 1920, 1080],
  ["toolbox", "impact.mp4", true, 1672, 1080],
  ["toolbox", "nada-1.jpg", false, 1000, 750],
  ["toolbox", "nada-2.jpg", false, 1000, 750],
  ["toolbox", "nada-3.jpg", false, 2048, 1321],
  // — Warpbnb
  ["warpbnb", "warp11.mp4", true, 1440, 1080],
  ["warpbnb", "figma-screens.mp4", true, 1680, 1080],
  ["warpbnb", "storybook.mp4", true, 1672, 1080],
  ["warpbnb", "reviews.mp4", true, 1922, 1080],
  ["warpbnb", "icons.png", false, 3840, 2160],
  ["warpbnb", "thiings.png", false, 3840, 2160],
  ["warpbnb", "prompt-arch.png", false, 3840, 2160],
  ["warpbnb", "automation-fail.png", false, 3840, 2160],
  ["warpbnb", "topaz.mp4", true, 1920, 1080],
  ["warpbnb", "particles.mp4", true, 1920, 1080],
  ["warpbnb", "snap.mp4", true, 1920, 1080],
  ["warpbnb", "rive-logo.mp4", true, 1920, 1080],
  ["warpbnb", "commercial.png", false, 3840, 2160],
  ["warpbnb", "voiceover.png", false, 3840, 2160],
  ["warpbnb", "slop.png", false, 3840, 2160],
  // — PathAI
  ["pathai", "path1.png", false, 5000, 3733],
  ["pathai", "problem.png", false, 1920, 892],
  ["pathai", "research-strip.mp4", true, 1864, 1080],
  ["pathai", "insights.png", false, 3840, 1400],
  ["pathai", "explorations-refs.png", false, 3050, 1964],
  ["pathai", "card-explorations.png", false, 2820, 1348],
  ["pathai", "card-iterations.png", false, 1788, 920],
  ["pathai", "decision-panel.png", false, 1410, 936],
  ["pathai", "decision-pivot.png", false, 1410, 767],
  ["pathai", "decision-tradeoffs.png", false, 1920, 1080],
  ["pathai", "workflow-create.mp4", true, 2476, 1716],
  ["pathai", "workflow-receive.mp4", true, 2082, 1482],
  ["pathai", "edge-cases.png", false, 2844, 1870],
  ["pathai", "spec-sheet.png", false, 2714, 1810],
];

const SHADES = ["#262626", "#222222", "#2a2a2a", "#202020", "#242424", "#282828"];

const PROJECT_LABEL: Record<string, string> = {
  toolbox: "TOOLBOX",
  warpbnb: "WARPBNB",
  pathai: "PATHAI",
};

// Interleave the three projects so neighbouring tiles come from different work —
// the grid should read as one mixed gallery, not three stacked albums.
function interleave(assets: Asset[]): Asset[] {
  const buckets = new Map<string, Asset[]>();
  for (const a of assets) {
    if (!buckets.has(a[0])) buckets.set(a[0], []);
    buckets.get(a[0])!.push(a);
  }
  const queues = [...buckets.values()];
  const out: Asset[] = [];
  let i = 0;
  while (out.length < assets.length) {
    const q = queues[i % queues.length];
    if (q.length) out.push(q.shift()!);
    i += 1;
  }
  return out;
}

const ORDERED = interleave(ASSETS);

export const TILES: Tile[] = ORDERED.map(([proj, file, video, w, h], i) => {
  const base = file.replace(/\.[^.]+$/, "");
  return {
    id: i + 1,
    ar: +(w / h).toFixed(3),
    shade: SHADES[i % SHADES.length],
    name: `${PROJECT_LABEL[proj]}: ${file.toUpperCase()}`,
    kind: video ? "VIDEO" : "IMAGE",
    w,
    h,
    thumb: `/${proj}/thumbs/${base}.jpg`,
    grid: video ? `/${proj}/grid/${file}` : `/${proj}/thumbs/${base}.jpg`,
    full: `/${proj}/${file}`,
    video,
    project: proj,
  };
});

// Justified rows, computed at runtime from the real container width so every
// row runs edge to edge — the widest tiles set the rhythm and side padding
// stays minimal. Varying the target aspect-sum per row keeps heights lively.
const AR_TARGETS = [5.4, 6.6, 4.8, 6.0, 7.0, 5.0, 6.3, 4.6];

export function packRows(tiles: Tile[], containerW: number, gap: number, zoom: number): Row[] {
  const rows: Row[] = [];
  let idx = 0;
  let r = 0;
  while (idx < tiles.length) {
    // Higher zoom => fewer tiles per row => bigger tiles.
    const target = AR_TARGETS[r % AR_TARGETS.length] / zoom;
    const row: Tile[] = [];
    let arSum = 0;
    while (idx < tiles.length) {
      const t = tiles[idx];
      if (row.length && arSum + t.ar > target * 1.15) break;
      row.push(t);
      arSum += t.ar;
      idx += 1;
      if (arSum >= target) break;
    }
    // Justify: solve row height so the row exactly fills the container.
    const gaps = gap * (row.length - 1);
    const h = Math.max(90, (containerW - gaps) / arSum);
    rows.push({ h, tiles: row });
    r += 1;
  }
  return rows;
}
