import type { Metadata } from "next";
import GridCanvas from "@/components/GridCanvas";

export const metadata: Metadata = {
  title: "Product Thinking · Mayank Kinger",
  description:
    "Product strategy case studies — data dictionaries, service blueprints, analytics frameworks, and agentic outreach.",
};

export default function ProductThinkingPage() {
  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialLens="systems" />
      </div>
    </main>
  );
}
