"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Metric } from "@/content/impact";
import { TextType } from "./text-type";

export function ImpactMetricsAnimated({ metrics }: { metrics: Metric[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [subStage, setSubStage] = useState<"pop" | "title" | "note">("pop");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const prefersReducedMotion = React.useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    () => false
  );

  // Scroll detection via IntersectionObserver
  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const rect = node.getBoundingClientRect();
    const isAlreadyInView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
    if (isAlreadyInView) {
      const timer = setTimeout(() => setInView(true), 0);
      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    } else {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Start sequence when inView becomes true
  useEffect(() => {
    if (!inView || prefersReducedMotion || activeStep >= 0) return;
    const timer = setTimeout(() => {
      setActiveStep(0);
      setSubStage("pop");
    }, 150);
    return () => clearTimeout(timer);
  }, [inView, prefersReducedMotion, activeStep]);

  // When a step enters "pop", let number fade in, then advance to "title"
  useEffect(() => {
    if (activeStep < 0 || activeStep >= metrics.length) return;
    if (subStage !== "pop") return;

    const timer = setTimeout(() => {
      setSubStage("title");
    }, 280);

    return () => clearTimeout(timer);
  }, [activeStep, subStage, metrics.length]);

  const handleTitleComplete = (stepIndex: number) => {
    if (activeStep === stepIndex && subStage === "title") {
      setSubStage("note");
    }
  };

  const handleNoteComplete = (stepIndex: number) => {
    if (activeStep === stepIndex && subStage === "note") {
      setCompletedSteps((prev) => (prev.includes(stepIndex) ? prev : [...prev, stepIndex]));

      const nextStep = stepIndex + 1;
      if (nextStep < metrics.length) {
        setTimeout(() => {
          setActiveStep(nextStep);
          setSubStage("pop");
        }, 140);
      } else {
        setActiveStep(metrics.length);
      }
    }
  };

  const isSSR = !mounted;

  return (
    <div ref={containerRef} className="metrics-grid">
      {metrics.map((metric, index) => {
        const verified = metric.value !== null && Boolean(metric.source);
        const noteText = verified ? metric.note || "" : "Verified data not yet published";
        const displayValue = metric.value || String(index + 1).padStart(2, "0");

        // Reduced motion or SSR shows everything static
        if (prefersReducedMotion || isSSR) {
          return (
            <div
              key={metric.label}
              className={`impact-metric ${verified ? "metric-verified" : ""}`}
            >
              <span className="metric-value">
                {displayValue}
              </span>
              <h3>{metric.label}</h3>
              <p>{noteText}</p>
              {verified && (
                <details className="metric-source">
                  <summary>Source & reporting period</summary>
                  <p>
                    {metric.source}
                    {metric.period && (
                      <>
                        <br />
                        As of {metric.period}
                      </>
                    )}
                  </p>
                </details>
              )}
            </div>
          );
        }

        const isCompleted = completedSteps.includes(index);
        const isFuture = activeStep < index && !isCompleted;

        // If completed: render pure clean static content
        if (isCompleted) {
          return (
            <div
              key={metric.label}
              className={`impact-metric impact-metric-animated ${verified ? "metric-verified" : ""}`}
            >
              <span className="metric-value metric-value-visible">
                {displayValue}
              </span>
              <h3>{metric.label}</h3>
              <p>{noteText}</p>
              {verified && (
                <details className="metric-source metric-details-fade">
                  <summary>Source & reporting period</summary>
                  <p>
                    {metric.source}
                    {metric.period && (
                      <>
                        <br />
                        As of {metric.period}
                      </>
                    )}
                  </p>
                </details>
              )}
            </div>
          );
        }

        // If future (waiting for previous parts to finish):
        if (isFuture) {
          return (
            <div
              key={metric.label}
              className={`impact-metric impact-metric-animated ${verified ? "metric-verified" : ""}`}
            >
              <span className="metric-value metric-value-hidden">
                {displayValue}
              </span>
              <h3>
                <span className="metric-content-hidden">{metric.label}</span>
              </h3>
              <p>
                <span className="metric-content-hidden">{noteText}</span>
              </p>
            </div>
          );
        }

        // If current (animating its turn):
        const isPopping = subStage === "pop";
        const isTypingTitle = subStage === "title";
        const isTypingNote = subStage === "note";

        return (
          <div
            key={metric.label}
            className={`impact-metric impact-metric-animated ${verified ? "metric-verified" : ""}`}
          >
            {/* Metric Value (Number) */}
            <span
              className={`metric-value ${isPopping ? "metric-value-pop" : "metric-value-visible"}`}
            >
              {displayValue}
            </span>

            {/* Label / Heading */}
            <h3>
              {isPopping && <span className="metric-content-hidden">{metric.label}</span>}
              {isTypingTitle && (
                <TextType
                  text={metric.label}
                  typingSpeed={16}
                  start={true}
                  showCursor={true}
                  cursorCharacter="|"
                  onComplete={() => handleTitleComplete(index)}
                />
              )}
              {isTypingNote && <span>{metric.label}</span>}
            </h3>

            {/* Note / Subtitle */}
            <p>
              {(isPopping || isTypingTitle) && (
                <span className="metric-content-hidden">{noteText}</span>
              )}
              {isTypingNote && (
                <TextType
                  text={noteText}
                  typingSpeed={12}
                  start={true}
                  showCursor={true}
                  cursorCharacter="|"
                  onComplete={() => handleNoteComplete(index)}
                />
              )}
            </p>

            {/* Source Details (only shows after note typing finishes) */}
            {verified && (
              <details className="metric-source metric-content-hidden">
                <summary>Source & reporting period</summary>
                <p>
                  {metric.source}
                  {metric.period && (
                    <>
                      <br />
                      As of {metric.period}
                    </>
                  )}
                </p>
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ImpactMetricsAnimated;
