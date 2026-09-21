import type { MetadataRoute } from "next";
import { indexable, site } from "@/content/site";
import { legal } from "@/content/legal";
import { publishedInsights } from "@/content/insights";
export default function robots(): MetadataRoute.Robots {
  return indexable
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/api/",
            ...(!legal.approved ? ["/privacy", "/terms"] : []),
            ...(!publishedInsights.length ? ["/insights"] : []),
          ],
        },
        sitemap: `${site.url}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
