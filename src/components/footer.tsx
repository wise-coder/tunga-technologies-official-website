import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, site } from "@/content/site";
import { etungo } from "@/content/solutions";
import { Container } from "./ui";
import { Wordmark } from "./brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-main">
          <div className="footer-brand">
            <Wordmark />
            <p>
              Technology built for
              <br />
              Rwanda’s progress.
            </p>
            <span className="footer-location">
              <span />
              Rooted in Rwanda. Building forward.
            </span>
          </div>
          <div>
            <h2>Explore</h2>
            <nav aria-label="Footer explore">
              {navigation.slice(0, 4).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2>Work with us</h2>
            <nav aria-label="Footer work with us">
              <Link href="/partners">Partner With Us</Link>
              <Link href="/contact">Contact</Link>
              {site.socials.map((social) => (
                <a
                  href={social.href}
                  key={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h2>Our products</h2>
            <a
              className="footer-product"
              href={etungo.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              e-tungo
              <ArrowUpRight size={18} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="footer-product-note">
              A product of
              <br />
              Tunga Technologies.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Tunga Technologies.</p>
          <span>Practical technology. Meaningful progress.</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
