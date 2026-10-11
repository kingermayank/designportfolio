import type { Metadata } from "next";
import { REVIEW_ROBOTS } from "@/lib/reviewMetadata";

// Review-only copy of the portfolio for Dive Club. Same components and
// content as the public site (links stay under /dive via lib/sitePath), but
// noindex, absent from the sitemap and navigation, and carrying the Inflight
// review widget. React 19 hoists this async script into the server-rendered
// <head>, so it's in the initial HTML of every /dive page and nowhere else.
export const metadata: Metadata = {
  robots: REVIEW_ROBOTS,
};

export default function DiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script src="https://inflight.co/widget.js" data-org="aius9qpt" data-path="/dive" async></script>
      {children}
    </>
  );
}
