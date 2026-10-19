import { ArrowRight } from "lucide-react";
import { processSteps } from "@/content/site";
import { Button, Container, SectionKicker } from "./interior-ui";
import type { ComponentProps } from "react";
import type { CTASection as SharedCTA } from "./sections";

export {
  SolutionCard,
  ProductVisual,
  PartnerCard,
  InsightCard,
  ImpactMetric,
} from "./sections";

export function CTASection({
  title = "Let’s build solutions that matter.",
  description = "We work with institutions, businesses, investors, development partners and communities that want practical technology with measurable value.",
  href = "/partners",
  label = "Partner With Us",
}: ComponentProps<typeof SharedCTA>) {
  return (
    <section className="cta-section">
      <Container>
        <div className="cta-inner">
          <div>
            <SectionKicker>Progress is a shared effort</SectionKicker>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <Button href={href} variant="white">
            {label}
          </Button>
        </div>
      </Container>
    </section>
  );
}

export function ProcessSteps() {
  return (
    <ol className="process-steps arrows-in">
      {processSteps.map((step, index) => (
        <li key={step.title}>
          <div className="process-marker">
            <span>0{index + 1}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </div>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
