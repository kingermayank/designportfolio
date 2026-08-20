import type { Metadata } from "next";
import GridCanvas from "@/components/GridCanvas";

export const metadata: Metadata = {
  title: "Design Engineering · Mayank Kinger",
  description:
    "Design engineering work — component systems, marketing sites, interactive prototypes, and full-stack builds.",
};

export default function DesignEngineeringPage() {
  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialLens="engineering" />
      </div>
    </main>
  );
}
