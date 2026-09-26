"use client";

import CaseStudyPanel from "@/components/CaseStudyPanel";
import PathAICaseStudy from "./PathAICaseStudy";

export default function PathAICaseStudyPanel({ onClose }: { onClose: () => void }) {
  return (
    <CaseStudyPanel title="PathAI case study" onClose={onClose}>
      <PathAICaseStudy />
    </CaseStudyPanel>
  );
}
