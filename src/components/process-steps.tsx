"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { BlurText } from "./ui";
import { processSteps } from "@/content/site";

export function ProcessSteps() {
  const ref = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("arrows-in");
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      node.classList.add("arrows-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("arrows-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ol className="process-steps" ref={ref}>
      {processSteps.map((step, index) => (
        <li key={step.title}>
          <div className="process-marker">
            <span>0{index + 1}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </div>
          <BlurText
            as="h3"
            text={step.title}
            delay={index * 90}
            stepDuration={30}
            direction="bottom"
          />
          <BlurText
            as="p"
            text={step.description}
            delay={index * 90 + 45}
            stepDuration={22}
            direction="bottom"
          />
        </li>
      ))}
    </ol>
  );
}
