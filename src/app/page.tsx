import { ArrowDown, Layers3, MapPin, ScanLine, UsersRound } from "lucide-react";
import { ProgressVisual, HillsVisual } from "@/components/brand";
import {
  Button,
  Container,
  SectionHeader,
  SectionKicker,
  TextLink,
} from "@/components/ui";
import {
  CTASection,
  ImpactPreview,
  ProcessSteps,
  SolutionCard,
} from "@/components/sections";
import { site } from "@/content/site";
import { solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Technology built for Rwanda’s progress",
  site.description,
  "/",
);

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <Container>
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <SectionKicker>Tunga Technologies</SectionKicker>
              <h1>
                Technology built
                <br />
                for Rwanda’s
                <br />
                <span className="headline-accent">progress.</span>
              </h1>
              <p>{site.description}</p>
              <div className="button-row">
                <Button href="/solutions">Explore Our Solutions</Button>
                <Button href="/partners" variant="secondary">
                  Partner With Us
                </Button>
              </div>
              <div className="hero-small-note">
                <MapPin size={14} aria-hidden="true" />
                Rooted in Rwanda. Designed for real life.
              </div>
            </div>
            <ProgressVisual />
          </div>
          <div className="home-hero-bottom">
            <span>LOCAL CHALLENGES. LASTING POSSIBILITIES.</span>
            <div className="hero-pillars">
              <span>
                <UsersRound size={16} aria-hidden="true" />
                People first
              </span>
              <span>
                <Layers3 size={16} aria-hidden="true" />
                Practical by design
              </span>
              <span>
                <ScanLine size={16} aria-hidden="true" />
                Impact focused
              </span>
            </div>
            <a
              className="text-link hero-scroll-link"
              href="#what-we-do"
              aria-label="Discover what Tunga does"
            >
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </Container>
      </section>
      <section className="section" id="what-we-do">
        <Container>
          <div className="what-we-do">
            <div>
              <SectionKicker>Purpose before product</SectionKicker>
              <h2>
                We build around
                <br />
                real problems.
              </h2>
            </div>
            <div className="what-we-do-copy">
              <p>
                We identify challenges affecting people, businesses and
                communities, validate what is needed, and build simple digital
                products that can be tested, measured and scaled.
              </p>
              <TextLink href="/about">Get to know Tunga</TextLink>
            </div>
          </div>
        </Container>
      </section>
      <section className="section section-soft">
        <Container>
          <SectionHeader
            kicker="Our solutions"
            title="Practical solutions for real needs."
          >
            <TextLink href="/solutions">Explore our solutions</TextLink>
          </SectionHeader>
          {solutions.map((solution) => (
            <SolutionCard key={solution.slug} solution={solution} />
          ))}
        </Container>
      </section>
      <section className="section">
        <Container>
          <SectionHeader
            kicker="From understanding to action"
            title="A clear path from problem to progress."
          />
          <ProcessSteps />
        </Container>
      </section>
      <ImpactPreview />
      <section className="section">
        <Container>
          <div className="rwanda-grid">
            <HillsVisual />
            <div className="rwanda-copy">
              <SectionKicker>Our context. Our commitment.</SectionKicker>
              <h2>Building alongside Rwanda’s transformation.</h2>
              <p>
                Our solutions are designed around real development challenges,
                with attention to digital transformation, market access,
                productivity, entrepreneurship and inclusive economic
                opportunity.
              </p>
              <TextLink href="/about">What guides our work</TextLink>
            </div>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
