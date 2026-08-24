import GridCanvas from "@/components/GridCanvas";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Product Strategy",
  description:
    "Product strategy case studies — data dictionaries, service blueprints, analytics frameworks, and agentic outreach.",
  path: "/product-strategy",
});

export default function ProductStrategyPage() {
  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialLens="systems" />
      </div>
    </main>
  );
}
