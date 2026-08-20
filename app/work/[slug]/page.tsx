import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkCasePage from "@/components/WorkCasePage";
import { LINKABLE_CASE_STUDIES, isCaseLinkable } from "@/lib/caseStudies";
import { createMetadata } from "@/lib/seo";

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
  });
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const study = LINKABLE_CASE_STUDIES.find((s) => s.slug === slug);
  if (!study || !isCaseLinkable(study)) notFound();

  return (
    <main className="stage">
      <div className="window">
        <WorkCasePage slug={study.slug} />
      </div>
    </main>
  );
}
