import type { Metadata } from "next";
import DesignEngineeringPage, { metadata as publicMetadata } from "@/app/design-engineering/page";
import { reviewMetadata } from "@/lib/reviewMetadata";

export const metadata: Metadata = reviewMetadata(publicMetadata);

export default DesignEngineeringPage;
