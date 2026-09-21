import { Compass, Focus } from "lucide-react";
import { Container, Hero, SectionHeader, SectionKicker } from "@/components/ui";
import { CTASection, ProcessSteps } from "@/components/sections";
import { values } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "About",
  "Meet Tunga Technologies, a Rwanda-focused company building practical and accessible digital solutions around real problems.",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <Hero
        kicker="About Tunga Technologies"
        title="We build technology around real problems."
        description="Tunga Technologies is a Rwanda-focused technology company creating simple, useful and scalable digital solutions."
        dark
      />
      <section className="section">
        <Container>
          <div className="purpose-grid">
            <div>
              <SectionKicker>Our purpose</SectionKicker>
              <h2 className="purpose-title">
                Technology should solve something that matters.
              </h2>
            </div>
            <p>
              Tunga Technologies identifies social and economic challenges,
              validates them with the people affected, and develops digital
              products that can improve access, productivity, opportunity and
              service delivery.
            </p>
          </div>
          <div className="mission-grid">
            <article className="mission-card">
              <Focus size={30} strokeWidth={1.5} aria-hidden="true" />
              <h3>Our mission</h3>
              <p>
                To build practical and accessible technology solutions that
                solve real challenges and contribute to Rwanda’s sustainable
                social and economic transformation.
              </p>
            </article>
            <article className="mission-card">
              <Compass size={30} strokeWidth={1.5} aria-hidden="true" />
              <h3>Our vision</h3>
              <p>
                To become a trusted Rwandan technology company recognized for
                building innovative solutions that improve lives, strengthen
                businesses and create measurable impact.
              </p>
            </article>
          </div>
        </Container>
      </section>
      <section className="section section-soft">
        <Container>
          <SectionHeader
            kicker="How we work"
            title="Listen carefully. Build purposefully."
            description="Our approach keeps the people affected by a challenge at the centre of the solution."
          />
          <ProcessSteps />
        </Container>
      </section>
      <section className="section">
        <Container>
          <div className="values-layout">
            <div>
              <SectionKicker>What we stand for</SectionKicker>
              <h2>Principles that show up in the work.</h2>
            </div>
            <ol className="values-list">
              {values.map((value, index) => (
                <li key={value.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
