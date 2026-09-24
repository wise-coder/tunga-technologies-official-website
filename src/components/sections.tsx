import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sprout,
  Users,
  Search,
  Handshake,
  Network,
  TrendingUp,
  CodeXml,
  Microscope,
} from "lucide-react";
import type { Insight } from "@/content/insights";
import { impactMetrics, type Metric } from "@/content/impact";
import { partnershipTypes } from "@/content/site";
import type { Solution } from "@/content/solutions";
import {
  Button,
  Container,
  SectionHeader,
  SectionKicker,
  SplitText,
  TextLink,
} from "./ui";
import { ImpactMetricsAnimated } from "./impact-metrics-animated";

export { ProcessSteps } from "./process-steps";

export function ProductVisual() {
  return (
    <div
      className="product-visual"
      aria-label="Illustration of how e-tungo connects sellers and buyers"
    >
      <div className="product-visual-header">
        <span className="product-mini-brand">
          <Sprout size={20} aria-hidden="true" /> e-tungo
        </span>
        <span>BY TUNGA TECHNOLOGIES</span>
      </div>
      <div className="marketplace-illustration">
        <div className="market-node market-seller">
          <Sprout size={28} aria-hidden="true" />
          <strong>Farmers & sellers</strong>
          <span>Share what’s available</span>
        </div>
        <div className="market-connection" aria-hidden="true">
          <span />
          <ArrowRight size={21} />
          <span />
        </div>
        <div className="market-node market-buyer">
          <Users size={28} aria-hidden="true" />
          <strong>Buyers & businesses</strong>
          <span>Find what you need</span>
        </div>
      </div>
      <div className="market-search">
        <Search size={18} aria-hidden="true" />
        <span>More visibility. Better connections.</span>
        <span className="market-search-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="product-visual-footer">
        <span>POST</span>
        <span>DISCOVER</span>
        <span>CONNECT</span>
      </div>
      <span className="illustration-label">
        Marketplace concept illustration
      </span>
    </div>
  );
}

export function SolutionCard({
  solution,
  headingLevel = 3,
}: {
  solution: Solution;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="solution-card">
      <div className="solution-card-copy">
        <div className="solution-card-labels">
          <span className="status-pill">
            <span />
            {solution.status}
          </span>
          <span className="solution-category">{solution.category}</span>
        </div>
        <Heading className="solution-title">{solution.name}</Heading>
        <p>{solution.description}</p>
        <div className="solution-audience">
          <span>
            <Check size={15} aria-hidden="true" /> Built for Rwanda
          </span>
          <span>
            <Check size={15} aria-hidden="true" /> Connect directly
          </span>
        </div>
        <div className="button-row">
          <Button href={`/solutions/${solution.slug}`}>
            Explore {solution.name}
          </Button>
          <a
            className="text-link"
            href={solution.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit platform
            <ArrowUpRight size={17} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <span className="product-attribution">
          {solution.name} is a product of Tunga Technologies.
        </span>
      </div>
      <ProductVisual />
    </article>
  );
}

export function ImpactMetric({ metric }: { metric: Metric }) {
  const verified = metric.value !== null && Boolean(metric.source);
  return (
    <div className={`impact-metric ${verified ? "metric-verified" : ""}`}>
      <span className="metric-value">
        {metric.value ?? "01"}
      </span>
      <h3>{metric.label}</h3>
      <p>{verified ? metric.note : "Verified data not yet published"}</p>
      {verified && (
        <details className="metric-source">
          <summary>Source & reporting period</summary>
          <p>
            {metric.source}
            {metric.period && (
              <>
                <br />
                As of {metric.period}
              </>
            )}
          </p>
        </details>
      )}
    </div>
  );
}

export function ImpactPreview() {
  return (
    <section className="section impact-section">
      <Container>
        <SectionHeader
          kicker="Progress with purpose"
          title="Impact that can be measured."
          description="Useful products are a starting point. The real measure is the opportunity they create."
        >
          <TextLink href="/impact" light>
            Our impact approach
          </TextLink>
        </SectionHeader>
        <ImpactMetricsAnimated metrics={impactMetrics.slice(0, 4)} />
        <p className="impact-footnote">
          <span aria-hidden="true" />
          We publish outcomes when the evidence is ready.
        </p>
      </Container>
    </section>
  );
}

export function CTASection({
  title = "Let’s build solutions that matter.",
  description = "We work with institutions, businesses, investors, development partners and communities that want practical technology with measurable value.",
  href = "/partners",
  label = "Partner With Us",
  dark = false,
}: {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
  dark?: boolean;
}) {
  return (
    <section className={`cta-section ${dark ? "cta-dark" : ""}`}>
      <Container>
        <div className="cta-inner">
          <div>
            <SectionKicker>Progress is a shared effort</SectionKicker>
            <SplitText tag="h2" text={title} delay={20} />
            <p>{description}</p>
          </div>
          <Button href={href} variant={dark ? "gold" : "primary"}>
            {label}
          </Button>
        </div>
      </Container>
    </section>
  );
}

const partnerIcons = [Handshake, Network, TrendingUp, CodeXml, Microscope];
export function PartnerCard({
  partner,
  index,
}: {
  partner: (typeof partnershipTypes)[number];
  index: number;
}) {
  const Icon = partnerIcons[index % partnerIcons.length];
  return (
    <article className="partner-card">
      <div className="partner-card-top">
        <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
        <span>0{index + 1}</span>
      </div>
      <h3>{partner.title}</h3>
      <p>{partner.description}</p>
      <p className="partner-detail">{partner.detail}</p>
      <Link
        href={`?type=${encodeURIComponent(partner.title)}#enquiry`}
        className="text-link"
      >
        Explore this partnership
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="insight-card">
      {insight.image ? (
        <Image
          src={insight.image.src}
          alt={insight.image.alt}
          width={640}
          height={360}
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      ) : (
        <div className="insight-art" aria-hidden="true">
          <span>t.</span>
          <ArrowUpRight size={60} />
        </div>
      )}
      <div className="insight-card-copy">
        <span className="kicker">{insight.category}</span>
        <h2>
          <Link href={`/insights/${insight.slug}`}>{insight.title}</Link>
        </h2>
        <p>{insight.summary}</p>
        <div className="article-meta">
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
        <TextLink href={`/insights/${insight.slug}`}>Read insight</TextLink>
      </div>
    </article>
  );
}
