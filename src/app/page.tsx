import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesCombined,
  CircleHelp,
  Compass,
  Layers3,
  MapPin,
  Sprout,
  Workflow,
} from "lucide-react";
import { FaqItem } from "@/components/faq-item";
import { SolutionExplorer } from "@/components/solution-explorer";
import {
  Button,
  Container,
  BlurText,
  SectionHeader,
  TextLink,
} from "@/components/ui";
import { CTASection, ImpactPreview, ProcessSteps } from "@/components/sections";
import { audienceLinks, homeQuestions } from "@/content/home";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import "./home.css";

export const metadata = pageMetadata(
  "Technology built for Rwanda’s progress",
  site.description,
  "/",
);

export default function HomePage() {
  return (
    <div className="home-page home-v2">
      <section className="hp-hero">
        <Container className="hp-container">
          <div className="home-hero-copy">
            <h1>
              <BlurText
                className="hp-hero-sans"
                text="Technology built for"
                delay={100}
                stepDuration={130}
                duration={850}
              />
              <BlurText
                className="hp-hero-serif"
                text="Rwanda’s progress."
                delay={520}
                stepDuration={130}
                duration={850}
              />
            </h1>
            <p>{site.description}</p>
            <div className="button-row">
              <Button href="/solutions" variant="white">
                Explore Our Solutions
              </Button>
              <Button href="/partners" variant="secondary">
                Partner With Us
              </Button>
            </div>
            <div className="hero-rooted">
              <MapPin size={17} aria-hidden="true" />
              <span>Rooted in Rwanda. Designed for real life.</span>
            </div>
          </div>
        </Container>
        <div className="hp-stage">
          <Image
            className="hp-stage-land"
            src="/nature image.png"
            alt=""
            width={1448}
            height={1086}
            sizes="100vw"
            priority
          />
          <div className="hp-glass" aria-hidden="true" />
          <figure className="hp-window">
            <div className="hp-window-bar">
              <span className="hp-window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="hp-window-address">
                <Sprout size={14} aria-hidden="true" />
                e-tungo.tungatechnologies.com
              </span>
              <span className="hp-window-status">Live</span>
            </div>
            <Image
              className="hp-window-shot"
              src="/e-tungo image.png"
              alt="e-tungo marketplace with livestock and animal product listings"
              width={1448}
              height={1086}
              sizes="(max-width: 767px) calc(100vw - 48px), 760px"
              priority
            />
          </figure>
        </div>
      </section>
      <div className="audience-wrap">
        <Container className="hp-container">
          <div className="audience-panel">
            <p className="audience-label">
              <BadgeCheck size={21} aria-hidden="true" />
              TECHNOLOGY BUILT AROUND PEOPLE
            </p>
            <nav
              aria-label="Find your path at Tunga"
              className="audience-links"
            >
              {audienceLinks.map((item) => (
                <Link href={item.href} key={item.title}>
                  <span className="audience-title">
                    {item.title}
                    <ArrowRight size={20} aria-hidden="true" />
                  </span>
                  <span className="audience-description">
                    {item.description}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </div>
      <section
        className="section centered-section introduction-section"
        id="what-we-do"
      >
        <Container className="hp-container">
          <div className="section-medallion">
            <Compass aria-hidden="true" />
          </div>
          <SectionHeader
            title="We build around real problems."
            description="We identify challenges affecting people, businesses and communities, validate what is needed, and build simple digital products that can be tested, measured and scaled."
          />
          <div className="centered-actions">
            <Button href="/about">Get to know Tunga</Button>
            <Button href="/partners" variant="secondary">
              Build with us
            </Button>
          </div>
        </Container>
      </section>
      <section className="section centered-section product-explorer-section hp-panel-section">
        <Container className="hp-container">
          <div className="hp-panel">
            <div className="section-medallion">
              <Sprout aria-hidden="true" />
            </div>
            <SectionHeader
              title="Practical solutions for real needs."
              description="A simple digital marketplace for animals and animal products, connecting livestock farmers, sellers and buyers across Rwanda."
            />
            <div className="centered-actions">
              <Button href="/solutions/e-tungo">Explore e-tungo</Button>
              <Button href="/solutions" variant="secondary">
                Our solutions
              </Button>
            </div>
            <SolutionExplorer />
          </div>
        </Container>
      </section>
      <section className="section centered-section process-section hp-panel-section">
        <Container className="hp-container">
          <div className="hp-panel">
            <div className="section-medallion">
              <Workflow aria-hidden="true" />
            </div>
            <SectionHeader
              title="From a real challenge to a useful solution."
              description="A clear approach. People at the centre. Evidence at every step."
            />
            <ProcessSteps />
          </div>
        </Container>
      </section>
      <div className="home-impact">
        <div className="impact-decoration" aria-hidden="true">
          <ChartNoAxesCombined />
        </div>
        <ImpactPreview />
      </div>
      <section className="section centered-section transformation-section hp-panel-section">
        <Container className="hp-container">
          <div className="hp-panel">
            <div className="section-medallion">
              <Layers3 aria-hidden="true" />
            </div>
            <SectionHeader
              title="Building alongside Rwanda’s transformation."
              description="Our solutions are designed around real development challenges, with attention to digital transformation, market access, productivity, entrepreneurship and inclusive economic opportunity."
            />
            <div className="transformation-panel">
              <Image
                className="transformation-image"
                src="/nature image.png"
                alt="Rwandan hills, farms, water, and a connected city landscape"
                width={1448}
                height={1086}
                sizes="(max-width: 767px) calc(100vw - 48px), 50vw"
              />
              <div>
                <h3>
                  Local understanding.
                  <br />
                  Lasting possibility.
                </h3>
                <p>
                  Technology should solve something that matters. We start from
                  Rwanda’s context while designing for scale.
                </p>
                <TextLink href="/about">What guides our work</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="section centered-section faq-section">
        <Container>
          <div className="section-medallion">
            <CircleHelp aria-hidden="true" />
          </div>
          <SectionHeader title="A little more about us." />
          <div className="faq-list">
            {homeQuestions.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
          <div className="centered-actions">
            <Button href="/about">About Tunga</Button>
            <Button href="/contact" variant="secondary">
              Other questions
            </Button>
          </div>
        </Container>
      </section>
      <CTASection />
    </div>
  );
}
