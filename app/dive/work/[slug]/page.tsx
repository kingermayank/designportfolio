import type { Metadata } from "next";
import WorkSlugPage, {
  generateMetadata as publicMetadata,
  generateStaticParams as publicParams,
} from "@/app/work/[slug]/page";
import { reviewMetadata } from "@/lib/reviewMetadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publicParams();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return reviewMetadata(await publicMetadata(props));
}

export default WorkSlugPage;
