"use client";

import { useRouter } from "next/navigation";
import About from "@/components/About";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="casePage">
      <About onClose={() => router.push("/")} />
    </div>
  );
}
