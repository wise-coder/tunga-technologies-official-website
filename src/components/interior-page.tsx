"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { whenPageVisible } from "./page-loader";

const revealTargets = [
  ".page-hero .kicker",
  ".page-hero h1",
  ".page-hero-aside",
  ".product-hero-grid > div",
  ".section-header",
  ".purpose-grid",
  ".mission-card",
  ".values-layout > div",
  ".values-list > li",
  ".process-steps > li",
  ".solution-card",
  ".criteria-card",
  ".impact-metric",
  ".framework-card",
  ".evidence-note",
  ".partner-card",
  ".partner-invitation",
  ".form-intro",
  ".contact-form",
  ".challenge-layout",
  ".response-card",
  ".product-gallery > figure",
  ".screenshot-pending",
  ".insight-topics",
  ".insight-card",
  ".empty-state",
  ".insights-etungo-promo",
  ".legal-body > section",
  ".legal-banner",
  ".article-body > section",
  ".cta-inner",
  ".error-page > .container",
].join(",");

/** A separate visual and motion scope; the landing page is passed through unchanged. */
export function InteriorPage({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = root.current;
    if (!page || pathname === "/") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;

    const stop = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const start = () => {
      if (preference.matches) return;
      const targets = Array.from(
        page.querySelectorAll<HTMLElement>(revealTargets),
      ).filter((element) => !element.parentElement?.closest(revealTargets));
      const reveal = (element: HTMLElement) => {
        observer?.unobserve(element);
        if (element.dataset.motionRevealed) return;
        element.dataset.motionRevealed = "true";
        if (element.getBoundingClientRect().bottom < 0 || preference.matches)
          return;
        const siblings = Array.from(element.parentElement?.children || []);
        const delay = Math.min(siblings.indexOf(element) % 4, 2) * 65;
        const animation = element.animate(
          [
            { opacity: 0, transform: "translateY(22px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 650,
            delay,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "backwards",
          },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      };
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
          });
        },
        { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
      );
      targets.forEach((element) => observer?.observe(element));
    };
    const cancelStart = whenPageVisible(start);
    const onPreferenceChange = () => {
      stop();
      if (!preference.matches) start();
    };

    // Keyboard navigation and changed motion preferences never wait for an animation.
    const onFocus = () => animations.forEach((animation) => animation.finish());
    preference.addEventListener("change", onPreferenceChange);
    page.addEventListener("focusin", onFocus);
    return () => {
      cancelStart();
      stop();
      preference.removeEventListener("change", onPreferenceChange);
      page.removeEventListener("focusin", onFocus);
    };
  }, [pathname, children]);

  if (pathname === "/") return children;
  return (
    <div
      ref={root}
      key={pathname}
      className="interior-page"
      data-page={pathname}
    >
      {children}
    </div>
  );
}
