"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";

export type TextTypeProps = {
  text: string | string[];
  as?: React.ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  onComplete?: () => void;
  startOnVisible?: boolean;
  start?: boolean;
  reverseMode?: boolean;
  style?: React.CSSProperties;
};

export function TextType({
  text,
  as: Component = "span",
  typingSpeed = 20,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = false,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.45,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  onComplete,
  startOnVisible = false,
  start = true,
  reverseMode = false,
  style,
  ...props
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [hasCompleted, setHasCompleted] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

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

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return "inherit";
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current && !hasCompleted) {
      const tween = gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
      return () => {
        tween.kill();
      };
    }
  }, [showCursor, cursorBlinkDuration, hasCompleted]);

  useEffect(() => {
    if (prefersReducedMotion) {
      onCompleteRef.current?.();
      return;
    }

    if (!isVisible || !start) return;

    let timeout: NodeJS.Timeout;
    const currentText = textArray[currentTextIndex] || "";
    const processedText = reverseMode
      ? currentText.split("").reverse().join("")
      : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            setHasCompleted(true);
            onCompleteRef.current?.();
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText((prev) => prev + processedText[currentCharIndex]);
              setCurrentCharIndex((prev) => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) {
            setHasCompleted(true);
            onCompleteRef.current?.();
            return;
          }
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    start,
    reverseMode,
    variableSpeed,
    getRandomSpeed,
    onSentenceComplete,
    prefersReducedMotion,
  ]);

  const shouldHideCursor =
    !showCursor ||
    hasCompleted ||
    prefersReducedMotion ||
    (hideCursorWhileTyping &&
      (currentCharIndex < (textArray[currentTextIndex] || "").length || isDeleting));

  const textToDisplay = prefersReducedMotion ? textArray[0] || "" : displayedText;

  return (
    <Component
      ref={containerRef as unknown as React.Ref<never>}
      className={`text-type ${className}`.trim()}
      style={style}
      {...props}
    >
      <span
        className="text-type__content"
        style={{ color: getCurrentTextColor() || "inherit" }}
      >
        {textToDisplay}
      </span>
      {showCursor && !shouldHideCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${cursorClassName}`.trim()}
          aria-hidden="true"
        >
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
}

export default TextType;
