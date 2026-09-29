"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import CaseStudies from "@/components/CaseStudies";
import { usePageTransition } from "@/components/PageTransition";
import { LINKABLE_CASE_STUDIES } from "@/lib/caseStudies";

export default function WorkCasePage({ slug }: { slug: string }) {
  const router = useRouter();
  const { open } = usePageTransition();
  const [returningHome, startReturnHome] = useTransition();

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
            if (returningHome) return;
            startReturnHome(() => router.push("/"));
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
      {returningHome && (
        <div className="caseReturnStatus">
          <span role="status">Opening Home…</span>
          {/* A document navigation provides recovery if the client router stalls. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Reload Home</a>
        </div>
      )}
    </div>
  );
}
