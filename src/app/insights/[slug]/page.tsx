import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs, Container, Hero, TextLink } from "@/components/ui";
import { publishedInsights } from "@/content/insights";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return publishedInsights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = publishedInsights.find((item) => item.slug === slug);
  if (!insight)
    return {
      title: "Insight not found",
      robots: { index: false, follow: true },
    };
  return pageMetadata(
    insight.title,
    insight.summary,
    `/insights/${insight.slug}`,
  );
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = publishedInsights.find((item) => item.slug === slug);
  if (!insight) notFound();
  return (
    <>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Insights", href: "/insights" },
            { label: insight.title },
          ]}
        />
      </Container>
      <Hero
        kicker={insight.category}
        title={insight.title}
        description={insight.summary}
      />
      <section className="section">
        <Container>
          <article className="article-body">
            <div className="article-meta">
              <span>{insight.author}</span>
              <time dateTime={insight.date}>
                {new Date(insight.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <span>{insight.readTime} min read</span>
            </div>
            {insight.image && (
              <Image
                src={insight.image.src}
                alt={insight.image.alt}
                width={1200}
                height={675}
                className="mb-12 h-auto w-full rounded-2xl"
                sizes="(max-width: 767px) 100vw, 760px"
              />
            )}
            {insight.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </section>
            ))}
            <div className="mt-12">
              <TextLink href="/insights">All insights</TextLink>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
