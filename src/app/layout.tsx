import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site, indexable } from "@/content/site";
import "./globals.css";
import "./theme.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Technology built for Rwanda’s progress`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots: { index: indexable, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description,
    ...(site.url.startsWith("https://") ? { url: site.url } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.socials.length
      ? { sameAs: site.socials.map((link) => link.href) }
      : {}),
  };
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <ScrollReveal />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
