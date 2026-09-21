import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  MoveUpRight,
} from "lucide-react";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function Button({
  children,
  href,
  variant = "primary",
  external = false,
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "gold" | "white";
  external?: boolean;
  className?: string;
}) {
  const contents = (
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
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`button button-${variant} ${className}`}
    >
      {contents}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={`button button-${variant} ${className}`}>
      {contents}
    </Link>
  );
}

export function TextLink({
  children,
  href,
  light = false,
}: {
  children: ReactNode;
  href: string;
  light?: boolean;
}) {
  return (
    <Link className={`text-link ${light ? "text-link-light" : ""}`} href={href}>
      {children}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="kicker">
      <span aria-hidden="true" />
      {children}
    </p>
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

export function Hero({
  kicker,
  title,
  description,
  children,
  dark = false,
}: {
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`page-hero ${dark ? "page-hero-dark" : ""}`}>
      <Container>
        <SectionKicker>{kicker}</SectionKicker>
        <div className="page-hero-grid">
          <h1>{title}</h1>
          <div className="page-hero-aside">
            <p>{description}</p>
            {children}
          </div>
        </div>
        <span className="hero-rule" aria-hidden="true" />
      </Container>
    </section>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            <ChevronRight size={14} aria-hidden="true" />
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <MoveUpRight aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
