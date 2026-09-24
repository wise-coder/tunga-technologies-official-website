import { MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PartnerCard } from "@/components/sections";
import {
  Container,
  Hero,
  SectionHeader,
  SectionKicker,
  SplitText,
  TextLink,
} from "@/components/ui";
import { partnershipTypes } from "@/content/site";
import { enquiryDeliveryReady } from "@/lib/form-config";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Partner with us",
  "Explore pilot, distribution, investment, technical and research partnerships with Tunga Technologies. Let’s build solutions that matter.",
  "/partners",
);

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialTopic = partnershipTypes.some(
    (partner) => partner.title === type,
  )
    ? type
    : "";
  return (
    <>
      <Hero
        kicker="Partner with Tunga"
        title="Let’s build solutions that matter."
        description="We work with institutions, businesses, investors, development partners and communities that want practical technology with measurable value."
        dark
      />
      <section className="section">
        <Container>
          <SectionHeader
            kicker="Ways to collaborate"
            title="Different strengths. Shared progress."
            description="Choose the relationship that fits your goal. Each starts with a real need and a conversation about what we can build together."
          />
          <div className="partner-grid">
            {partnershipTypes.map((partner, index) => (
              <PartnerCard
                partner={partner}
                index={index}
                key={partner.title}
              />
            ))}
            <div className="partner-invitation">
              <MessageSquare size={28} strokeWidth={1.5} aria-hidden="true" />
              <h3>Another way to work together?</h3>
              <p>
                Good ideas don’t always fit a category. We’d like to hear yours.
              </p>
              <TextLink href="/contact">Start a conversation</TextLink>
            </div>
          </div>
        </Container>
      </section>
      <section className="section section-soft" id="enquiry">
        <Container>
          <div className="form-layout">
            <div className="form-intro">
              <SectionKicker>Start a conversation</SectionKicker>
              <SplitText
                tag="h2"
                text="Tell us what problem you’re trying to solve."
                delay={20}
              />
              <p>
                Share a little about your organization, the people you serve and
                the opportunity you see.
              </p>
              <p className="form-intro-note">
                Our team will review your enquiry and respond through the
                contact details you provide.
              </p>
            </div>
            <ContactForm
              kind="partnership"
              available={enquiryDeliveryReady()}
              initialTopic={initialTopic}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
