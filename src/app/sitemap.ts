import type { MetadataRoute } from "next";
import { indexable, site } from "@/content/site";
import { legal } from "@/content/legal";
import { publishedInsights } from "@/content/insights";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  const paths = [
    "/",
    "/about",
    "/solutions",
    "/solutions/e-tungo",
    "/impact",
    "/partners",
    "/contact",
    ...(legal.approved ? ["/privacy", "/terms"] : []),
    ...(publishedInsights.length ? ["/insights"] : []),
  ];
  return [
    ...paths.map((path) => ({ url: `${site.url}${path}` })),
    ...publishedInsights.map((insight) => ({
      url: `${site.url}/insights/${insight.slug}`,
      lastModified: insight.date,
    })),
  ];
}
