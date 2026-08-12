"use client";

import { Figtree } from "next/font/google";
import SearchFieldStandalone from "@/components/labs/SearchFieldStandalone";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function WarpSearchLab() {
  return (
    <main className={`labWarpSearch ${figtree.className}`}>
      <div className="labWarpSearchInner">
        <SearchFieldStandalone />
      </div>
    </main>
  );
}
