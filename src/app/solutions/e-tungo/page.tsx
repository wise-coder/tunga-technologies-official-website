import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  ImageIcon,
  MessageCircle,
  RefreshCw,
  Search,
  Upload,
} from "lucide-react";
import {
  BlurText,
  Breadcrumbs,
  Button,
  Container,
  SectionHeader,
  SectionKicker,
  SplitText,
} from "@/components/ui";
import { CTASection, ProductVisual } from "@/components/sections";
import { ImpactMetricsAnimated } from "@/components/impact-metrics-animated";
import { etungo, productScreenshots, productSteps } from "@/content/solutions";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "e-tungo — Livestock marketplace",
  "e-tungo is a simple marketplace for animals and animal products in Rwanda. Discover the challenge, the product and Tunga’s approach.",
  "/solutions/e-tungo",
);
const icons = [Upload, Search, MessageCircle, RefreshCw];
const audiences = [
  "Livestock farmers and individual sellers",
  "Buyers and households",
  "Cooperatives",
  "Traders",
  "Butcheries, restaurants and businesses",
];

const etungoMetrics = [
  { label: "Active listings", value: "01" },
  { label: "Farmer & seller accounts", value: "02" },
  { label: "Buyer enquiries", value: "03" },
  { label: "Successful connections", value: "04" },
];

export default function EtungoPage() {
  return (
    <>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Solutions", href: "/solutions" },
            { label: "e-tungo" },
          ]}
        />
      </Container>
      <section className="product-hero">
        <Container>
          <div className="product-hero-grid">
            <div>
              <SectionKicker>Tunga solution · Live</SectionKicker>
              <SplitText tag="h1" text="e-tungo" delay={25} splitType="chars" />
              <p>
                A simple marketplace for animals and animal products in Rwanda.
              </p>
              <div className="button-row">
                <Button href={etungo.url} external variant="gold">
                  Visit e-tungo
                </Button>
                <Button
                  href="/partners?type=Pilot%20Partner#enquiry"
                  variant="white"
                >
                  Partner on e-tungo
                </Button>
              </div>
              <span className="product-attribution">
                e-tungo is a product of Tunga Technologies.
              </span>
            </div>
            <ProductVisual />
          </div>
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="challenge-layout">
            <div>
              <SectionKicker>The challenge</SectionKicker>
              <SplitText tag="h2" text="What’s available shouldn’t be hard to find." delay={20} />
            </div>
            <p>
              A livestock farmer may have an animal ready for sale but limited
              visibility beyond nearby contacts. At the same time, a buyer may
              be looking for livestock without knowing what is available, where
              it is located, or how to contact the seller.
            </p>
          </div>
        </Container>
      </section>
      <section className="section section-soft">
        <Container>
          <SectionHeader
            kicker="The response"
            title="A simpler way to find each other."
            description="From a listing to a conversation, e-tungo makes the connection more direct."
          />
          <div className="response-grid">
            {productSteps.map((step, index) => {
              const Icon = icons[index];
              return (
                <article className="response-card" key={step.title}>
                  <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
                  <BlurText
                    as="h3"
                    text={step.title}
                    delay={index * 90}
                    stepDuration={30}
                    direction="bottom"
                  />
                  <BlurText
                    as="p"
                    text={step.description}
                    delay={index * 90 + 50}
                    stepDuration={24}
                    direction="bottom"
                  />
                </article>
              );
            })}
          </div>
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="challenge-layout">
            <div>
              <SectionKicker>Who it serves</SectionKicker>
              <SplitText tag="h2" text="Connecting people across the livestock market." delay={20} />
            </div>
            <ul className="audience-list">
              {audiences.map((audience, index) => (
                <li key={audience}>
                  <Check size={18} aria-hidden="true" />
                  <BlurText
                    text={audience}
                    delay={index * 90}
                    stepDuration={30}
                    direction="bottom"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <section className="section section-soft">
        <Container>
          <SectionHeader
            kicker="Explore the product"
            title="See e-tungo in action."
          />
          {productScreenshots.length > 0 ? (
            <div className="product-gallery">
              {productScreenshots.map((shot) => (
                <figure key={shot.src}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="screenshot-pending">
              <ImageIcon size={34} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3>Product screenshots are being prepared.</h3>
                <p>Explore the live platform to see the current marketplace.</p>
              </div>
              <a
                href={etungo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Visit e-tungo
                <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          )}
        </Container>
      </section>
      <section className="section impact-section">
        <Container>
          <SectionHeader
            kicker="Product evidence"
            title="A connection is only the beginning."
            description="We look at marketplace activity and feedback to understand what is useful. Verified product results will be published as evidence becomes available."
          />
          <ImpactMetricsAnimated metrics={etungoMetrics} />
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="evidence-note">
            <SectionKicker>Future development</SectionKicker>
            <SplitText tag="h2" text="Improve with the people who use it." delay={20} />
            <p>
              Marketplace activity and community feedback guide what comes next.
              Future improvements will be shaped by validated needs, usability
              and evidence of value. New capabilities will be shared when they
              are ready.
            </p>
          </div>
        </Container>
      </section>
      <CTASection
        title="Help useful connections go further."
        description="Explore a pilot, distribution opportunity or technical collaboration around e-tungo."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "e-tungo",
            url: etungo.url,
            description: etungo.description,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            creator: { "@type": "Organization", name: "Tunga Technologies" },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
