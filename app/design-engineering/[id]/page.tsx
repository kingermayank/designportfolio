import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GridCanvas from "@/components/GridCanvas";
import { ENG_COMPONENTS } from "@/lib/workLenses";
import { createMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return ENG_COMPONENTS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = ENG_COMPONENTS.find((c) => c.id === id);
  if (!item) return { title: "Not found", robots: { index: false } };

  return createMetadata({
    title: item.title,
    description: item.body,
    path: `/design-engineering/${item.id}`,
  });
}

export default async function DesignEngineeringItemPage({ params }: Props) {
  const { id } = await params;
  const item = ENG_COMPONENTS.find((c) => c.id === id);
  if (!item) notFound();

  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialLens="engineering" initialOpenItem={item.id} />
      </div>
    </main>
  );
}
