import type { Metadata } from "next";
import DesignEngineeringItemPage, {
  generateMetadata as publicMetadata,
  generateStaticParams as publicParams,
} from "@/app/design-engineering/[id]/page";
import { reviewMetadata } from "@/lib/reviewMetadata";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return publicParams();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return reviewMetadata(await publicMetadata(props));
}

export default DesignEngineeringItemPage;
