import type { Metadata } from "next";
import { indexable, site } from "@/content/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  ready = true,
): Metadata {
  return {
    title: { absolute: `${title} | ${site.name}` },
    description,
    alternates: { canonical: path },
    robots: { index: indexable && ready, follow: true },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "en_RW",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
