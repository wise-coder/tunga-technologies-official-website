"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

export type SplitTextProps = {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: "chars" | "words";
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

export function SplitText({
  text,
  children,
  className = "",
  delay = 24,
  duration = 560,
  splitType = "chars",
  tag: Tag = "h2",
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  textAlign,
  onAnimationComplete,
  style,
}: SplitTextProps) {
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
  const ref = useRef<HTMLElement>(null);

  const words = useMemo(() => {
    if (!content) return [];
    return content.trim().split(/\s+/).filter(Boolean);
  }, [content]);

  const totalChars = useMemo(() => {
    if (splitType === "words") return words.length;
    return words.reduce((acc, word) => acc + word.length, 0);
  }, [words, splitType]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = ref.current;
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
      const timer = setTimeout(() => setInView(true), 0);
      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    } else {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, prefersReducedMotion]);

  useEffect(() => {
    if (!inView || !onAnimationComplete || totalChars === 0) return;
    const totalTimeMs = totalChars * delay + duration;
    const timer = setTimeout(onAnimationComplete, totalTimeMs);
    return () => clearTimeout(timer);
  }, [inView, onAnimationComplete, totalChars, delay, duration]);

  if (!content && children) {
    return (
      <Tag
        ref={ref as unknown as React.Ref<never>}
        className={`split-parent ${className}`.trim()}
        style={{ textAlign, ...style }}
      >
        {children}
      </Tag>
    );
  }

  const isAnimated = prefersReducedMotion || (mounted && inView);
  const isHiddenBeforeReveal = !prefersReducedMotion && mounted && !inView;

  let globalCharIndex = 0;

  return (
    <Tag
      ref={ref as unknown as React.Ref<never>}
      className={`split-parent ${className}`.trim()}
      style={{ textAlign, ...style }}
    >
      {words.map((word, wordIndex) => {
        const wordKey = `word-${wordIndex}`;

        if (splitType === "words") {
          const currentWordIndex = wordIndex;
          const charDelay = currentWordIndex * delay;
          return (
            <React.Fragment key={wordKey}>
              <span
                className={`split-word split-char ${
                  isAnimated ? "split-char-in" : isHiddenBeforeReveal ? "split-char-from" : ""
                }`}
                style={
                  {
                    "--char-delay": `${charDelay}ms`,
                    "--split-duration": `${duration}ms`,
                  } as React.CSSProperties
                }
              >
                {word}
              </span>
              {wordIndex < words.length - 1 && " "}
            </React.Fragment>
          );
        }

        // splitType === "chars"
        const letters = word.split("");
        return (
          <React.Fragment key={wordKey}>
            <span className="split-word">
              {letters.map((char, charIdx) => {
                const currentGlobalIndex = globalCharIndex++;
                const charDelay = currentGlobalIndex * delay;
                return (
                  <span
                    key={`${wordKey}-char-${charIdx}`}
                    className={`split-char ${
                      isAnimated ? "split-char-in" : isHiddenBeforeReveal ? "split-char-from" : ""
                    }`}
                    style={
                      {
                        "--char-delay": `${charDelay}ms`,
                        "--split-duration": `${duration}ms`,
                      } as React.CSSProperties
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </Tag>
  );
}

export default SplitText;
