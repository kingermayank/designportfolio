import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkCasePage from "@/components/WorkCasePage";
import { CASE_STUDIES } from "@/lib/caseStudies";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  if (!study) return { title: "Not found" };

  return {
    title: `${study.title} — Mayank Kinger`,
    description: study.description,
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((s) => s.slug === slug);
  if (!study) notFound();

  return (
    <main className="stage">
      <div className="window">
        <WorkCasePage slug={study.slug} />
      </div>
    </main>
  );
}
