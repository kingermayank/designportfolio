import type { Metadata } from "next";
import WarpSearchLab from "@/components/labs/WarpSearchLab";

export const metadata: Metadata = {
  title: "Warpbnb search field · Lab",
  robots: { index: false, follow: false },
};

export default function SearchLabPage() {
  return <WarpSearchLab />;
}
