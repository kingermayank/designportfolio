"use client";

import { useRouter } from "next/navigation";
import CaseStudies from "@/components/CaseStudies";

export default function WorkCasePage({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <div className="casePage">
      <CaseStudies
        key={slug}
        externalEntry={{
          slug,
          onClose: () => router.push("/"),
          onNavigate: (next) => router.push(`/work/${next}`),
        }}
        layout="editorial"
      />
    </div>
  );
}
