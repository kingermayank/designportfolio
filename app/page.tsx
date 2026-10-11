import GridCanvas from "@/components/GridCanvas";
import IntroWireframe from "@/components/IntroWireframe";
import { parseHomeView } from "@/lib/homeViews";

type Props = {
  searchParams: Promise<{ view?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { view } = await searchParams;

  return (
    <main className="stage">
      <IntroWireframe />
      <div className="window">
        <GridCanvas initialView={parseHomeView(view)} />
      </div>
    </main>
  );
}
