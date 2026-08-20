import GridCanvas from "@/components/GridCanvas";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Design Engineering",
  description:
    "Design engineering work — component systems, marketing sites, interactive prototypes, and full-stack builds.",
  path: "/design-engineering",
});

export default function DesignEngineeringPage() {
  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialLens="engineering" />
      </div>
    </main>
  );
}
