import AboutPage from "@/components/AboutPage";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description:
    "I'm a T-shaped, systems-thinking product designer who thrives in ambiguity, blurring the lines between business priorities, product strategy, and implementation to deliver tangible impact.",
  path: "/about",
});

export default function AboutRoute() {
  return (
    <main className="stage">
      <div className="window">
        <AboutPage />
      </div>
    </main>
  );
}
