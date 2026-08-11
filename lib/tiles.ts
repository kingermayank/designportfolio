export type Tile = {
  id: number;
  ar: number; // natural aspect ratio, width / height
  shade: string; // fill shown before the thumbnail paints
  name: string; // label shown in the canvas header
  kind: "IMAGE" | "VIDEO";
  w: number; // true pixel dimensions, shown in the header
  h: number;
  thumb: string; // still image, or poster for video
  grid: string; // what the grid plays: video loop, or same as thumb for stills
  full: string; // original asset, shown when a tile is zoomed
  video: boolean;
  project: string;
};

export type Row = { h: number; tiles: Tile[] };

type Asset = [proj: string, file: string, video: boolean, w: number, h: number];

// PathAI + Warpbnb (vibe code) only — current case-study media stack.
const ASSETS: Asset[] = [
  // — PathAI
  ["pathai", "path1-1.png", false, 1742, 1966],
  ["pathai", "path1-2.png", false, 5462, 4096],
  ["pathai", "path2.png", false, 3224, 1816],
  ["pathai", "path3.png", false, 3288, 2192],
  ["pathai", "path7.mp4", true, 3668, 2064],
  ["pathai", "path8.png", false, 2700, 1520],
  ["pathai", "path9.png", false, 2720, 1814],
  ["pathai", "path10.mp4", true, 3840, 2160],
  ["pathai", "path11.png", false, 2738, 1542],
  // — Warpbnb
  ["warpbnb", "warp1.png", false, 3840, 2160],
  ["warpbnb", "warp2.png", false, 2146, 1138],
  ["warpbnb", "warp3-1.mp4", true, 3348, 2160],
  ["warpbnb", "warp3-2.mp4", true, 3840, 1820],
  ["warpbnb", "warp4.png", false, 4066, 2285],
  ["warpbnb", "warp5.png", false, 4074, 2292],
  ["warpbnb", "warp6.mp4", true, 1922, 1080],
  ["warpbnb", "warp7.mp4", true, 3340, 2160],
  ["warpbnb", "warp8.mp4", true, 1920, 1080],
];

const SHADES = ["#262626", "#222222", "#2a2a2a", "#202020", "#242424", "#282828"];

const PROJECT_LABEL: Record<string, string> = {
  warpbnb: "WARPBNB",
  pathai: "PATHAI",
};

// Interleave so neighbouring tiles come from different work —
// the grid should read as one mixed gallery, not stacked albums.
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
  const src = `/${proj}/${file}`;
  return {
    id: i + 1,
    ar: +(w / h).toFixed(3),
    shade: SHADES[i % SHADES.length],
    name: `${PROJECT_LABEL[proj]}: ${file.toUpperCase()}`,
    kind: video ? "VIDEO" : "IMAGE",
    w,
    h,
    // No separate thumbs/grid exports for the current stack — use the
    // authored files directly; videos borrow the project cover as poster.
    thumb: video ? `/${proj}/cover.png` : src,
    grid: src,
    full: src,
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
