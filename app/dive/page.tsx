import type { Metadata } from "next";
import Home from "@/app/page";
import { reviewMetadata } from "@/lib/reviewMetadata";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = reviewMetadata(createMetadata());

export default Home;
