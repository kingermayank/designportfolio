import GridCanvas from "@/components/GridCanvas";

type Props = {
  searchParams: Promise<{ view?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { view } = await searchParams;

  return (
    <main className="stage">
      <div className="window">
        <GridCanvas initialMode={view === "grid" ? "grid" : "work"} />
      </div>
    </main>
  );
}
