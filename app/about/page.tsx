import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "About — Mayank Kinger",
  description:
    "I'm a T-shaped, systems-thinking product designer who thrives in ambiguity, blurring the lines between business priorities, product strategy, and implementation to deliver tangible impact.",
};

export default function AboutRoute() {
  return (
    <main className="stage">
      <div className="window">
        <AboutPage />
      </div>
    </main>
  );
}
