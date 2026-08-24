import type { MetadataRoute } from "next";
import { LINKABLE_CASE_STUDIES } from "@/lib/caseStudies";
import { SITE_URL } from "@/lib/seo";
import { ENG_COMPONENTS, SYSTEMS_LIST } from "@/lib/workLenses";

const staticRoutes = ["/", "/about", "/product-strategy", "/design-engineering"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...staticRoutes,
    ...LINKABLE_CASE_STUDIES.map((study) => `/work/${study.slug}`),
    ...SYSTEMS_LIST.map(
      (item) => `/product-strategy/${item.slug ?? item.id}`,
    ),
    ...ENG_COMPONENTS.map((item) => `/design-engineering/${item.id}`),
  ];

  return routes.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.split("/").length === 2 ? 0.8 : 0.7,
  }));
}
