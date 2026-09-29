import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { navigation, site } from "@/content/site";
import { ArrowSlideContent, Container } from "./ui";
import { TechText } from "./tech-text";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-reference-grid">
          <div className="footer-contact">
            {site.socials.length > 0 && (
              <nav aria-label="Tunga social links" className="footer-socials">
                {site.socials.map((social) => (
                  <a
                    href={social.href}
                    key={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.label.slice(0, 1)}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </nav>
            )}
            <p>
              Kigali, Rwanda
              <br />
              Rooted locally. Building forward.
            </p>
            {site.email && (
              <a className="footer-email" href={`mailto:${site.email}`}>
                <Mail size={16} aria-hidden="true" />
                {site.email}
              </a>
            )}
          </div>
          <div className="footer-links-group">
            <h2>Explore</h2>
            <nav aria-label="Footer explore">
              {navigation.slice(0, 4).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footer-links-group">
            <h2>Work with us</h2>
            <nav aria-label="Footer work with us">
              <Link href="/partners">Partner with us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/solutions">Our solutions</Link>
            </nav>
          </div>
          <div className="footer-links-group">
            <h2>Company</h2>
            <nav aria-label="Footer company">
              <Link href="/about">About</Link>
              <Link href="/impact">Impact</Link>
              <Link href="/insights">Insights</Link>
            </nav>
          </div>
        </div>
        <div className="footer-reference-bottom">
          <p>Technology built for Rwanda’s progress.</p>
          <Link href="/partners" className="footer-start-link">
            <ArrowSlideContent arrow={<ArrowRight size={17} aria-hidden="true" />} animation="none">
              Get started
            </ArrowSlideContent>
          </Link>
          <nav aria-label="Legal">
            <Link href="/terms">Terms &amp; conditions</Link>
            <Link href="/privacy">Privacy policy</Link>
          </nav>
        </div>
      </Container>
      <TechText
        text="Tunga Techz"
        className="footer-display-name"
        color="#e3f0ff"
        accentColor="#87bafa"
      />
    </footer>
  );
}
