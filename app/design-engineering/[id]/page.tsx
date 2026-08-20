import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GridCanvas from "@/components/GridCanvas";
import { ENG_COMPONENTS } from "@/lib/workLenses";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return ENG_COMPONENTS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = ENG_COMPONENTS.find((c) => c.id === id);
  if (!item) return { title: "Not found" };

  return {
    title: `${item.title} · Mayank Kinger`,
    description: item.body,
  };
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
