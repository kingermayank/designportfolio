"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CaseStudies from "@/components/CaseStudies";
import { usePageTransition } from "@/components/PageTransition";
import { LINKABLE_CASE_STUDIES } from "@/lib/caseStudies";

export default function WorkCasePage({ slug }: { slug: string }) {
  const router = useRouter();
  const { open } = usePageTransition();

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <div className="casePage">
      <CaseStudies
        key={slug}
        externalEntry={{
          slug,
          onClose: () => {
            open(
              "/",
              { title: "Visual Craft", subtitle: "Selected work" },
              "back",
            );
          },
          onNavigate: (next) => {
            const study = LINKABLE_CASE_STUDIES.find((s) => s.slug === next);
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
