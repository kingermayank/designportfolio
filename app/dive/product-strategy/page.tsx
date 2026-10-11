import type { Metadata } from "next";
import ProductStrategyPage, { metadata as publicMetadata } from "@/app/product-strategy/page";
import { reviewMetadata } from "@/lib/reviewMetadata";

export const metadata: Metadata = reviewMetadata(publicMetadata);

export default ProductStrategyPage;
