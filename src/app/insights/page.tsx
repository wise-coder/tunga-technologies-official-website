import { InsightCard } from "@/components/sections";
import { Button, Container, EmptyState, Hero } from "@/components/ui";
import { publishedInsights } from "@/content/insights";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Insights",
  "Product updates, field notes and practical lessons from Tunga Technologies. A growing record of what we build and learn.",
  "/insights",
  publishedInsights.length > 0,
);

export default function InsightsPage() {
  return (
    <>
      <Hero
        kicker="Insights & perspectives"
        title="What we build. What we learn."
        description="Product updates, field notes and practical lessons from the work of turning real challenges into useful technology."
      />
      <section className="section">
        <Container>
          <div className="insight-topics" aria-label="Editorial areas">
            <span>Product updates</span>
            <span>Field notes</span>
            <span>Case studies</span>
            <span>Company announcements</span>
            <span>Research & lessons</span>
          </div>
          {publishedInsights.length > 0 ? (
            <div className="insights-grid">
              {publishedInsights.map((insight) => (
                <InsightCard insight={insight} key={insight.slug} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Our next chapter is taking shape."
              description="We’re preparing stories from our products and the lessons behind them. In the meantime, explore e-tungo to see our approach in practice."
            >
              <Button href="/solutions/e-tungo">Discover e-tungo</Button>
            </EmptyState>
          )}
        </Container>
      </section>
    </>
  );
}
