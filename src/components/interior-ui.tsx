import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode, CSSProperties } from "react";
import {
  Container,
  SectionKicker,
  Button as SharedButton,
  Hero as SharedHero,
} from "./ui";

export {
  Container,
  SectionKicker,
  TextLink,
  Breadcrumbs,
  EmptyState,
} from "./ui";

// Inner pages reveal complete text blocks, keeping reading order and accessible names intact.
export function Heading({
  text,
  children,
  tag: Tag = "h2",
  className,
  style,
}: {
  text: string;
  children?: ReactNode;
  tag?: "h1" | "h2" | "h3";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag className={className} style={style}>
      {text || children}
    </Tag>
  );
}

export function TextBlock({
  text,
  children,
  as: Tag = "span",
  className,
  style,
}: {
  text: string;
  children?: ReactNode;
  as?: "span" | "p" | "h3";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag className={className} style={style}>
      {text || children}
    </Tag>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  external = false,
  className = "",
}: ComponentProps<typeof SharedButton>) {
  const content = (
    <>
      {children}
      {external ? (
        <ArrowUpRight size={18} aria-hidden="true" />
      ) : (
        <ArrowRight size={18} aria-hidden="true" />
      )}
    </>
  );
  return external ? (
    <a
      className={`button button-${variant} interior-button ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link
      className={`button button-${variant} interior-button ${className}`}
      href={href}
    >
      {content}
    </Link>
  );
}

export function Hero({
  kicker,
  title,
  description,
  children,
}: ComponentProps<typeof SharedHero>) {
  const words = title.trim().split(/\s+/);
  const accentCount = words.length > 5 ? 3 : 2;
  const lead = words.slice(0, -accentCount).join(" ");
  const accent = words.slice(-accentCount).join(" ");
  return (
    <section className="page-hero">
      <Container>
        <SectionKicker>{kicker}</SectionKicker>
        <div className="page-hero-grid">
          <h1>
            {lead && <>{lead} </>}
            <em>{accent}</em>
          </h1>
          <div className="page-hero-aside">
            <p>{description}</p>
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SectionHeader({
  kicker,
  title,
  description,
  children,
}: {
  kicker?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        {kicker && <SectionKicker>{kicker}</SectionKicker>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {children}
    </div>
  );
}
