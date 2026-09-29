import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

// Repackage videos used by the Visual Craft case studies. Keep their public
// paths stable; the player adds a version query so existing CDN copies expire.
const source = readFileSync("lib/caseStudies.ts", "utf8");
const paths = [...new Set(
  [...source.matchAll(/"(\/(?:toolbox|warpbnb|walkity|bigbasket|pathai|rolipoli)\/[^"?]+\.mp4)"/g)]
    .map((match) => match[1]),
)];
const encodeAbove = 8 * 1024 * 1024;
const manifestPath = "lib/videoHashes.generated.json";
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : {};
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

function run(input, output, encode, maxWidth = 2560) {
  const args = encode
    ? ["-v", "error", "-y", "-i", input, "-map", "0:v:0", "-map", "0:a?", "-vf", `scale=min(${maxWidth}\\,iw):-2`, "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", "-f", "mp4", output]
    : ["-v", "error", "-y", "-i", input, "-map", "0", "-c", "copy", "-movflags", "+faststart", "-f", "mp4", output];
  const result = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${input}`);
}

for (const url of paths) {
  const file = path.join("public", url.slice(1));
  if (!existsSync(file)) throw new Error(`Missing media: ${file}`);

  const bytes = readFileSync(file);
  if (manifest[url] === hash(bytes)) continue;
  const needsFastStart = bytes.indexOf("moov") > bytes.indexOf("mdat");
  const cardCover = url.endsWith("/thumbnail-optimized.mp4");
  const shouldEncode = cardCover || bytes.length >= encodeAbove;
  if (!needsFastStart && !shouldEncode) continue;

  const temporary = `${file}.optimizing.mp4`;
  try {
    console.log(`${shouldEncode ? "Encode" : "Remux"} ${url}`);
    run(file, temporary, shouldEncode, cardCover ? 1600 : 2560);
    // If re-encoding does not save enough, keep the original pixels and only
    // move metadata. A small file-size win is not worth another generation.
    if (shouldEncode && statSync(temporary).size >= bytes.length * 0.85) {
      rmSync(temporary);
      if (needsFastStart) run(file, temporary, false);
      else {
        manifest[url] = hash(bytes);
        continue;
      }
    }
    console.log(`  ${(bytes.length / 1048576).toFixed(1)} → ${(statSync(temporary).size / 1048576).toFixed(1)} MiB`);
    renameSync(temporary, file);
    manifest[url] = hash(readFileSync(file));
  } finally {
    rmSync(temporary, { force: true });
  }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
