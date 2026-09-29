import videoHashes from "@/lib/videoHashes.generated.json";

// Content hashes bypass older browser and CDN copies without requiring new
// filenames every time a video is repackaged.

export function videoAssetUrl(src: string): string {
  if (!src.startsWith("/") || !/\.mp4(?:\?|$)/i.test(src)) return src;
  const pathname = src.split("?")[0];
  const revision = (videoHashes as Record<string, string>)[pathname]?.slice(0, 12);
  return revision
    ? `${src}${src.includes("?") ? "&" : "?"}v=${revision}`
    : src;
}
