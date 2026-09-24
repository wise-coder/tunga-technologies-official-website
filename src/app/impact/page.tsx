import { BlurText, Container, Hero, SectionHeader, SectionKicker, SplitText } from "@/components/ui";
import { CTASection, ImpactMetric } from "@/components/sections";
import { impactFramework, impactMetrics } from "@/content/impact";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Our impact",
  "How Tunga Technologies measures adoption, outcomes and feedback, with verified evidence and a responsible approach to growth.",
  "/impact",
);

export default function ImpactPage() {
  return (
    <>
      <Hero
        kicker="Impact"
        title="We measure what changes, not just what we launch."
        description="Tunga Technologies tracks real adoption, outcomes and feedback so that products can improve responsibly."
      />
      <section className="section impact-section">
        <Container>
          <SectionHeader
            kicker="Our progress"
            title="Evidence before claims."
            description="The figures below reflect what we can substantiate. Verified data will be published as it becomes available."
          />
          <div className="impact-full-grid">
            {impactMetrics.map((metric) => (
              <ImpactMetric key={metric.label} metric={metric} />
            ))}
          </div>
        </Container>
      </section>
      <section className="section">
        <Container>
          <SectionHeader
            kicker="Our impact framework"
            title="Four questions behind every product."
          />
          <div className="impact-framework">
            {impactFramework.map((item, index) => (
              <article className="framework-card" key={item.title}>
                <span className="framework-number">0{index + 1}</span>
                <BlurText
                  as="h3"
                  text={item.title}
                  delay={index * 90}
                  stepDuration={30}
                  direction="bottom"
                />
                <BlurText
                  as="p"
                  text={item.description}
                  delay={index * 90 + 45}
                  stepDuration={22}
                  direction="bottom"
                />
                <BlurText
                  as="p"
                  text={item.detail}
                  delay={index * 90 + 90}
                  stepDuration={22}
                  direction="bottom"
                />
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="section section-soft">
        <Container>
          <div className="evidence-note">
            <SectionKicker>A growing record of learning</SectionKicker>
            <SplitText
              tag="h2"
              text="Every result needs a source."
              delay={20}
            />
            <p>
              Our evidence will bring together product activity, user feedback
              and verified outcomes. Case studies, pilot results and community
              perspectives will be shared when they are documented and approved
              for publication.
            </p>
            <p>
              We distinguish between a product being used and a meaningful
              improvement in someone’s experience. Both matter; they answer
              different questions.
            </p>
          </div>
        </Container>
      </section>
      <CTASection
        title="Help us understand what changes."
        description="Work with Tunga to validate needs, evaluate outcomes and build a stronger evidence base for practical technology."
      />
    </>
  );
}
