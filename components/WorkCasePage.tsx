"use client";

import { useRouter } from "next/navigation";
import CaseStudies from "@/components/CaseStudies";
import { usePageTransition } from "@/components/PageTransition";
import { CASE_STUDIES } from "@/lib/caseStudies";

export default function WorkCasePage({ slug }: { slug: string }) {
  const router = useRouter();
  const { open } = usePageTransition();

  return (
    <div className="casePage">
      <CaseStudies
        key={slug}
        externalEntry={{
          slug,
          onClose: () => router.push("/"),
          onNavigate: (next) => {
            const study = CASE_STUDIES.find((s) => s.slug === next);
            open(`/work/${next}`, {
              title: study?.title ?? next,
              subtitle: study ? `${study.category}, ${study.year}` : undefined,
            });
          },
        }}
        layout="editorial"
      />
    </div>
  );
}
