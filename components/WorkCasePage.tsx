"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CraftStream from "@/components/CraftStream";
import { usePageTransition } from "@/components/PageTransition";

export default function WorkCasePage({ slug }: { slug: string }) {
  const router = useRouter();
  const { open } = usePageTransition();

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <div className="casePage">
      <CraftStream key={slug} slug={slug} onClose={() => {
        open("/", { title: "Visual Craft", subtitle: "Selected work" }, "back");
      }} />
    </div>
  );
}
