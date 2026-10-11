import type { Metadata } from "next";

/** Review copy (/dive): never indexed, never followed, never cached. */
export const REVIEW_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};

/** A public page's metadata, made safe for the review copy. */
export function reviewMetadata(meta: Metadata): Metadata {
  return { ...meta, robots: REVIEW_ROBOTS };
}
