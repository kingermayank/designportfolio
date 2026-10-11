"use client";

import { useRouter } from "next/navigation";
import About from "@/components/About";
import ModeToggle from "@/components/ModeToggle";
import { usePageTransition } from "@/components/PageTransition";
import { toSite } from "@/lib/sitePath";

export default function AboutPage() {
  const router = useRouter();
  const { open } = usePageTransition();

  return (
    <div className="casePage">
      <About
        onClose={() =>
          open("/", { title: "Home", subtitle: "Mayank Kinger" }, "back")
        }
      />
      <ModeToggle on={false} onToggle={() => router.push(toSite("/?view=grid"))} />
    </div>
  );
}
