"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type FoldHinge = "top" | "bottom" | "left" | "right";
export type FoldSplit = "char" | "chars" | "word" | "words" | "line" | "lines";
export type FoldTrigger = "mount" | "scroll" | "hover" | "loop";

export type FoldTextProps = {
  text?: string;
  children?: React.ReactNode;
  splitBy?: FoldSplit;
  hinge?: FoldHinge;
  duration?: number; // seconds (default 0.65) or ms
  stagger?: number; // seconds (default 0.045) or ms
  ease?: string;
  perspective?: number;
  creaseShading?: number; // 0 to 1, default 0.55
  trigger?: FoldTrigger;
  fontSize?: number | string;
  fontWeight?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  tag?: React.ElementType;
  onAnimationComplete?: () => void;
};

const HINGE_CONFIG: Record<
  FoldHinge,
  { origin: string; rotateX: number; rotateY: number }
> = {
  top: { origin: "50% 0%", rotateX: -92, rotateY: 0 },
  bottom: { origin: "50% 100%", rotateX: 92, rotateY: 0 },
  left: { origin: "0% 50%", rotateX: 0, rotateY: 92 },
  right: { origin: "100% 50%", rotateX: 0, rotateY: -92 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (React.isValidElement(children)) {
    if (children.type === "br") return "\n";
    const props = children.props as { children?: React.ReactNode };
    if (props && props.children) return extractText(props.children);
  }
  return "";
}

export function FoldText({
  text,
  children,
  splitBy = "char",
  hinge = "top",
  duration = 0.65,
  stagger = 0.038,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.55,
  trigger = "mount",
  fontSize,
  fontWeight,
  color,
  className = "",
  style = {},
  as: ComponentAs,
  tag: ComponentTag,
  onAnimationComplete,
}: FoldTextProps) {
  const Component = ComponentAs || ComponentTag || "span";
  const rootRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Normalize duration & stagger if passed in milliseconds (> 10)
  const safeDuration = duration > 10 ? duration / 1000 : duration;
  const safeStagger = stagger > 1 ? stagger / 1000 : stagger;

  const content = text ?? (children ? extractText(children) : "Technology");
  const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const lines = useMemo(() => {
    return content.split("\n");
  }, [content]);

  const segments = useMemo(() => {
    let segmentIndex = 0;

    const renderPiece = (pieceContent: string, key: string, splitType: string) => {
      segmentIndex += 1;
      return (
        <span
          className="fold-text-segment"
          data-fold-split={splitType}
          key={key}
          style={{ "--fold-perspective": `${safePerspective}px` } as React.CSSProperties}
        >
          <span
            className="fold-text-piece"
            data-fold-hinge={hinge}
            style={
              {
                transformOrigin: hingeConfig.origin,
                "--fold-crease": safeCrease,
              } as React.CSSProperties
            }
          >
            {pieceContent || "\u00A0"}
          </span>
        </span>
      );
    };

    if (splitBy === "line" || splitBy === "lines") {
      return lines.map((line, idx) => (
        <React.Fragment key={`line-frag-${idx}`}>
          <span className="fold-text-line">
            {renderPiece(line || "\u00A0", `line-${idx}`, "line")}
          </span>
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ));
    }

    if (splitBy === "word" || splitBy === "words") {
      return lines.map((line, lineIdx) => {
        const words = line.split(/\s+/).filter(Boolean);
        return (
          <React.Fragment key={`line-${lineIdx}`}>
            {words.map((w, wIdx) => (
              <React.Fragment key={`word-${lineIdx}-${wIdx}`}>
                {renderPiece(w, `word-${segmentIndex}`, "word")}
                {wIdx < words.length - 1 && <span className="fold-text-whitespace"> </span>}
              </React.Fragment>
            ))}
            {lineIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      });
    }

    // Default: splitBy === "char" | "chars"
    return lines.map((line, lineIdx) => {
      const words = line.split(/\s+/).filter(Boolean);
      return (
        <React.Fragment key={`line-${lineIdx}`}>
          {words.map((w, wIdx) => (
            <React.Fragment key={`word-${lineIdx}-${wIdx}`}>
              <span className="fold-text-word">
                {Array.from(w).map((char, cIdx) =>
                  renderPiece(char, `char-${lineIdx}-${wIdx}-${cIdx}`, "char")
                )}
              </span>
              {wIdx < words.length - 1 && <span className="fold-text-whitespace"> </span>}
            </React.Fragment>
          ))}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  }, [lines, splitBy, hinge, hingeConfig.origin, safeCrease, safePerspective]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const pieces = Array.from(root.querySelectorAll(".fold-text-piece"));
    if (!pieces.length) return undefined;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const activeDuration = reduceMotion ? Math.min(safeDuration, 0.2) : safeDuration;
    const activeStagger = reduceMotion ? Math.min(safeStagger, 0.01) : safeStagger;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      rotateX: reduceMotion ? 0 : hingeConfig.rotateX,
      rotateY: reduceMotion ? 0 : hingeConfig.rotateY,
      "--fold-crease": reduceMotion ? 0 : safeCrease,
      transformOrigin: hingeConfig.origin,
      force3D: true,
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      "--fold-crease": 0,
      duration: activeDuration,
      ease: reduceMotion ? "power1.out" : ease,
      stagger: activeStagger,
      clearProps: "willChange",
      onComplete: onAnimationComplete,
    };

    const killTimeline = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.killTweensOf(pieces);
    };

    const play = (repeat = false) => {
      killTimeline();
      timelineRef.current = gsap.timeline({
        repeat: repeat ? -1 : 0,
        repeatDelay: repeat ? 0.75 : 0,
      });
      timelineRef.current.fromTo(pieces, fromVars, toVars);
      return timelineRef.current;
    };

    let scrollTrigger: ScrollTrigger | undefined;
    let hoverHandler: (() => void) | undefined;

    if (trigger === "hover") {
      gsap.set(pieces, {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        "--fold-crease": 0,
        transformOrigin: hingeConfig.origin,
      });
      hoverHandler = () => play(false);
      root.addEventListener("mouseenter", hoverHandler);
    } else if (trigger === "scroll") {
      gsap.set(pieces, fromVars);
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => play(false),
      });
    } else if (trigger === "loop") {
      play(true);
    } else {
      // "mount": run immediately
      play(false);
    }

    // Support hover replay
    const replayOnHover = () => {
      if (trigger !== "hover" && !reduceMotion) {
        play(false);
      }
    };
    root.addEventListener("mouseenter", replayOnHover);

    return () => {
      root.removeEventListener("mouseenter", replayOnHover);
      if (hoverHandler) root.removeEventListener("mouseenter", hoverHandler);
      scrollTrigger?.kill();
      killTimeline();
    };
  }, [
    content,
    splitBy,
    hinge,
    safeDuration,
    safeStagger,
    ease,
    safePerspective,
    safeCrease,
    trigger,
    hingeConfig.origin,
    hingeConfig.rotateX,
    hingeConfig.rotateY,
    onAnimationComplete,
  ]);

  const rootStyle: React.CSSProperties = {
    "--fold-text-font-size":
      typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    "--fold-text-font-weight": fontWeight,
    "--fold-text-color": color,
    ...style,
  } as React.CSSProperties;

  return (
    <Component
      ref={rootRef as unknown as React.Ref<never>}
      className={`fold-text ${className}`.trim()}
      style={rootStyle}
    >
      <span className="fold-text-sr-only">{content}</span>
      <span className="fold-text-visual" aria-hidden="true">
        {segments}
      </span>
    </Component>
  );
}

export default FoldText;
