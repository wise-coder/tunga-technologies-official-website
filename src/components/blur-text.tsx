"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

export type BlurTextProps = {
  text?: string;
  children?: React.ReactNode;
  delay?: number;
  stepDuration?: number;
  duration?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  as?: React.ElementType;
  triggerKey?: string | number | boolean;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

export function BlurText({
  text,
  children,
  delay = 0,
  stepDuration = 38,
  duration = 540,
  className = "",
  animateBy = "words",
  direction = "bottom",
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  as: Component = "span",
  triggerKey,
  onAnimationComplete,
  style,
}: BlurTextProps) {
  const content = text ?? (typeof children === "string" ? children : "");
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const prefersReducedMotion = React.useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const isInitialTrigger = useRef(true);

  const segments = useMemo(() => {
    if (!content) return [];
    if (animateBy === "words") {
      return content.split(/\s+/).filter(Boolean);
    }
    return content.split("");
  }, [content, animateBy]);

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
      { threshold, rootMargin },
    );

    const rect = node.getBoundingClientRect();
    const isAboveOrInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isAboveOrInViewport) {
      const initTimer = setTimeout(() => setInView(true), 0);
      return () => {
        clearTimeout(initTimer);
        observer.disconnect();
      };
    } else {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, prefersReducedMotion]);

  useEffect(() => {
    if (isInitialTrigger.current) {
      isInitialTrigger.current = false;
      return;
    }
    if (triggerKey !== undefined) {
      let innerTimer: NodeJS.Timeout;
      const resetTimer = setTimeout(() => {
        setInView(false);
        innerTimer = setTimeout(() => {
          setInView(true);
        }, 35);
      }, 0);
      return () => {
        clearTimeout(resetTimer);
        clearTimeout(innerTimer);
      };
    }
  }, [triggerKey]);

  useEffect(() => {
    if (!inView || !onAnimationComplete || segments.length === 0) return;
    const totalTimeMs = delay + segments.length * stepDuration + duration;
    const timer = setTimeout(onAnimationComplete, totalTimeMs);
    return () => clearTimeout(timer);
  }, [inView, onAnimationComplete, segments.length, delay, stepDuration, duration]);

  if (!content && children) {
    return (
      <Component ref={containerRef} className={className} style={style}>
        {children}
      </Component>
    );
  }

  // When reduced motion is preferred or before client mounting, render standard text
  const isAnimated = prefersReducedMotion || (mounted && inView);
  const isHiddenBeforeReveal = !prefersReducedMotion && mounted && !inView;

  return (
    <Component
      ref={containerRef}
      className={`blur-text-wrap ${className}`.trim()}
      style={style}
    >
      {segments.map((segment, index) => {
        const wordDelayMs = delay + index * stepDuration;
        return (
          <React.Fragment key={index}>
            <span
              className={`blur-text-word ${
                isAnimated ? "blur-text-in" : isHiddenBeforeReveal ? "blur-text-from" : ""
              }`}
              style={
                {
                  "--blur-delay": `${wordDelayMs}ms`,
                  "--blur-duration": `${duration}ms`,
                  "--blur-offset": direction === "top" ? "-18px" : "18px",
                } as React.CSSProperties
              }
            >
              {segment}
            </span>
            {animateBy === "words" && index < segments.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </Component>
  );
}

export default BlurText;
