import { BlurText, Container, Hero, SectionHeader } from "@/components/ui";
import { CTASection, SolutionCard } from "@/components/sections";
import { selectionCriteria, solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Our solutions",
  "Explore practical Tunga products, including e-tungo, Rwanda’s marketplace for animals and animal products.",
  "/solutions",
);

export default function SolutionsPage() {
  return (
    <>
      <Hero
        kicker="Our solutions"
        title="Products designed to move communities forward."
        description="Each Tunga solution begins with a real problem, not a feature list."
      />
      <section className="section">
        <Container>
          {solutions.map((solution) => (
            <SolutionCard
              solution={solution}
              key={solution.slug}
              headingLevel={2}
            />
          ))}
        </Container>
      </section>
      <section className="section section-soft">
        <Container>
          <SectionHeader
            kicker="How we choose what to build"
            title="A real need. A useful response."
            description="We look for the places where practical technology can make a meaningful difference."
          />
          <div className="criteria-grid">
            {selectionCriteria.map((criterion, index) => (
              <article className="criteria-card" key={criterion.title}>
                <span>0{index + 1}</span>
                <BlurText
                  as="h3"
                  text={criterion.title}
                  delay={index * 90}
                  stepDuration={30}
                  direction="bottom"
                />
                <BlurText
                  as="p"
                  text={criterion.description}
                  delay={index * 90 + 45}
                  stepDuration={22}
                  direction="bottom"
                />
              </article>
            ))}
          </div>
        </Container>
      </section>
      <CTASection
        title="See a challenge we could solve together?"
        href="/contact"
        label="Start a conversation"
      />
    </>
  );
}
