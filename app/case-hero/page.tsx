import type { Metadata } from "next";
import {
  CaseHero,
  ContentCard,
  HeroImage,
  MetadataList,
  PrimaryButton,
} from "@/components/case-hero";

export const metadata: Metadata = {
  title: "Case hero — template",
  robots: { index: false, follow: false },
};

/** Example metadata: four label/value rows plus one wrapped tag row. */
const META = [
  { label: "Company", value: "Warpbnb" },
  { label: "Role", value: "Product Designer" },
  { label: "Focus", value: "Full-Stack AI Build" },
];

const TAGS = {
  label: "Focus area",
  values: [
    "Branding",
    "Product Strategy",
    "UX Strategy",
    "UI Design",
    "Product Development",
    "Web Development",
    "Motion Design",
    "Prototyping",
  ],
};

const SAMPLE = {
  title: "Reimagining Airbnb for time travel across eras.",
  description:
    "A process breakdown of a fictional side project done end to end: design, code, images, content, and a video commercial, all using AI. Two weeks, solo, zero to shipped.",
  media: {
    src: "/warpbnb/cover.png",
    shade: "#2b2b2b",
    alt: "Warpbnb browse screen",
  },
  ctaHref: "https://www.warpbnb.com/",
  meta: META,
  metaTags: TAGS,
  back: { label: "All projects", href: "/" },
};

export default function CaseHeroTemplatePage() {
  return (
    <main className="chDemo">
      <header className="chDemoHead">
        <h1>Case hero</h1>
        <p>
          One continuous hero: the image is the background layer, the content
          group sits unboxed over its lower edge, and a back chevron pins to the
          top-left of the image. No scrim is drawn — legibility comes from the
          art itself. Composed from <code>HeroImage</code>,{" "}
          <code>ContentCard</code>, <code>MetadataList</code> and{" "}
          <code>PrimaryButton</code>.
        </p>
      </header>

      <section className="chDemoBlock">
        <h2 className="chDemoLabel">Neutral (default)</h2>
        <CaseHero {...SAMPLE} />
      </section>

      <section className="chDemoBlock">
        <h2 className="chDemoLabel">Accent CTA — tone: dark</h2>
        <CaseHero {...SAMPLE} tone="dark" accent="#ff0257" />
      </section>

      <section className="chDemoBlock chDemoOnLight">
        <h2 className="chDemoLabel">Tone: light</h2>
        <CaseHero {...SAMPLE} tone="light" />
      </section>

      <section className="chDemoBlock">
        <h2 className="chDemoLabel">
          Composed by hand — explicit ratio instead of a full-height cover
        </h2>
        {/* The same primitives, assembled directly rather than via CaseHero. */}
        <div className="chHero">
          <HeroImage src="/warpbnb/warp2.png" ratio={16 / 9} shade="#2b2b2b" alt="" />
          <ContentCard>
            <p className="chEyebrow">Side project</p>
            <h2 className="chTitle">Zero to shipped in two weeks.</h2>
            <p className="chDesc">
              Drop the <code>aside</code> prop and the content runs full width —
              the same tokens, spacing and entrance.
            </p>
            <div className="chActions">
              <PrimaryButton variant="ghost" href="#" icon={null}>
                Secondary action
              </PrimaryButton>
            </div>
          </ContentCard>
        </div>
      </section>

      <section className="chDemoBlock">
        <h2 className="chDemoLabel">MetadataList on its own</h2>
        <div className="chHero chDemoMeta">
          <MetadataList items={META} tags={TAGS} />
        </div>
      </section>
    </main>
  );
}
