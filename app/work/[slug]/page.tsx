import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkCasePage from "@/components/WorkCasePage";
import { LINKABLE_CASE_STUDIES, isCaseLinkable } from "@/lib/caseStudies";
import { createMetadata, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return LINKABLE_CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = LINKABLE_CASE_STUDIES.find((s) => s.slug === slug);
  if (!study) return { title: "Not found", robots: { index: false } };

  return createMetadata({
    title: study.title,
    description: study.description,
    path: `/work/${study.slug}`,
    image: {
      url: `/social/cases/${study.slug}.jpg`,
      alt: `${study.title} case study by Mayank Kinger`,
      width: 1200,
      height: 630,
    },
    type: "article",
  });
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const study = LINKABLE_CASE_STUDIES.find((s) => s.slug === slug);
  if (!study || !isCaseLinkable(study)) notFound();

  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.detailTitle ?? study.title,
    description: study.description,
    url: new URL(`/work/${study.slug}`, SITE_URL).toString(),
    dateCreated: String(study.year),
    creator: {
      "@type": "Person",
      name: "Mayank Kinger",
      url: SITE_URL.toString(),
    },
  };

  return (
    <main className="stage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(caseStudyJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="window">
        <WorkCasePage slug={study.slug} />
      </div>
    </main>
  );
}
