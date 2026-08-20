import GridCanvas from "@/components/GridCanvas";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Product Thinking",
  description:
    "Product strategy case studies — data dictionaries, service blueprints, analytics frameworks, and agentic outreach.",
  path: "/product-thinking",
});

export default function ProductThinkingPage() {
  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialLens="systems" />
      </div>
    </main>
  );
}
