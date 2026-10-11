import type { Metadata } from "next";
import AboutRoute, { metadata as publicMetadata } from "@/app/about/page";
import { reviewMetadata } from "@/lib/reviewMetadata";

export const metadata: Metadata = reviewMetadata(publicMetadata);

export default AboutRoute;
