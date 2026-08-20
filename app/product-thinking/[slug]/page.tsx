import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GridCanvas from "@/components/GridCanvas";
import { createMetadata } from "@/lib/seo";
import { SYSTEMS_LIST } from "@/lib/workLenses";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SYSTEMS_LIST.map((item) => ({ slug: item.slug ?? item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = SYSTEMS_LIST.find((s) => s.slug === slug || s.id === slug);
  if (!item) return { title: "Not found", robots: { index: false } };

  return createMetadata({
    title: item.title,
    description: item.body,
    path: `/product-thinking/${item.slug ?? item.id}`,
  });
}

export default async function ProductThinkingItemPage({ params }: Props) {
  const { slug } = await params;
  const item = SYSTEMS_LIST.find((s) => s.slug === slug || s.id === slug);
  if (!item) notFound();

  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialLens="systems" initialOpenItem={item.slug ?? item.id} />
      </div>
    </main>
  );
}
