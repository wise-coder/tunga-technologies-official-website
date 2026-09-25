"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Matches fixed header + scroll-padding-top for in-page anchors */
const ANCHOR_OFFSET = -120;

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const previousPathname = useRef<string | null>(null);
  const destroyRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!lenisRef.current) {
      const lenis = new Lenis({
        autoRaf: true,
        lerp: 0.085,
        duration: 1.15,
        smoothWheel: true,
        syncTouch: false,
        autoToggle: true,
        anchors: { offset: ANCHOR_OFFSET },
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      });

      lenisRef.current = lenis;

      const onLenisScroll = () => {
        ScrollTrigger.update();
      };
      lenis.on("scroll", onLenisScroll);

      destroyRef.current = () => {
        lenis.off("scroll", onLenisScroll);
        lenis.destroy();
        lenisRef.current = null;
        destroyRef.current = null;
      };
    }

    const lenis = lenisRef.current;
    const pathChanged =
      previousPathname.current !== null &&
      previousPathname.current !== pathname;
    previousPathname.current = pathname;

    requestAnimationFrame(() => {
      lenis.resize();
      const hash = window.location.hash;
      if (hash) {
        lenis.scrollTo(hash, { offset: ANCHOR_OFFSET });
        ScrollTrigger.refresh();
      } else if (pathChanged) {
        lenis.scrollTo(0, { immediate: true });
        ScrollTrigger.refresh();
      }
    });
  }, [pathname]);

  useEffect(() => {
    return () => {
      destroyRef.current?.();
    };
  }, []);

  return null;
}
