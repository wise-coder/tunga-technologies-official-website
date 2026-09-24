import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Container, Hero, SectionKicker, SplitText, TextLink } from "@/components/ui";
import { site } from "@/content/site";
import { enquiryDeliveryReady } from "@/lib/form-config";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Contact",
  "Have a problem worth solving, a partnership idea or a question about a Tunga product? Start a conversation with Tunga Technologies.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <Hero
        kicker="Start a conversation"
        title="Talk to Tunga Technologies."
        description="Have a problem worth solving, a partnership idea, or a question about one of our products? Send us a message."
      />
      <section className="section section-soft">
        <Container>
          <div className="form-layout">
            <div className="form-intro">
              <SectionKicker>We’re here to listen</SectionKicker>
              <SplitText
                tag="h2"
                text="Good solutions start with a conversation."
                delay={20}
              />
              <p>
                Tell us what you’re working on, what you need or what could work
                better. Your perspective is a useful place to begin.
              </p>
              {(site.email || site.phone || site.socials.length > 0) && (
                <div className="contact-channels">
                  {site.email && (
                    <a href={`mailto:${site.email}`}>
                      <Mail size={18} aria-hidden="true" />
                      {site.email}
                    </a>
                  )}
                  {site.phone && (
                    <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
                      <Phone size={18} aria-hidden="true" />
                      {site.phone}
                    </a>
                  )}
                  {site.socials.map((social) => (
                    <a
                      href={social.href}
                      key={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                      <ArrowUpRight size={17} aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
              <p className="form-intro-note">
                Interested in piloting, distributing or supporting a solution?
              </p>
              <TextLink href="/partners">Explore ways to partner</TextLink>
            </div>
            <ContactForm available={enquiryDeliveryReady()} />
          </div>
        </Container>
      </section>
    </>
  );
}
