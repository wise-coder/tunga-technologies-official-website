"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = document.querySelectorAll<HTMLElement>(
      "main > section, .section:not(.legal-body section), .audience-panel, .cta-section",
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((el) => {
      if (el.classList.contains("is-revealed")) return;

      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        el.classList.add("is-revealed");
      } else {
        el.classList.add("reveal-on-scroll");
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
