"use client";

import { useRouter } from "next/navigation";
import About from "@/components/About";
import ModeToggle from "@/components/ModeToggle";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="casePage">
      <About onClose={() => router.push("/")} />
      <ModeToggle on={false} onToggle={() => router.push("/?view=grid")} />
    </div>
  );
}
