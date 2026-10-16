"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Shortest time the screen stays up, so it never flashes on fast loads.
const MIN_INITIAL_MS = 700;
const MIN_NAVIGATION_MS = 450;
// Never hold the page hostage to a slow or broken image.
const MAX_WAIT_MS = 6000;

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function windowLoaded() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) =>
    window.addEventListener("load", () => resolve(), { once: true }),
  );
}

// Resolves when the images in the first screenful have loaded or failed.
// Lazy images further down only load once scrolled to, so they are skipped.
function imagesSettled() {
  const pending = (
    Array.from(document.querySelectorAll("main img")) as HTMLImageElement[]
  ).filter(
    (image) =>
      !image.complete &&
      image.getBoundingClientRect().top < window.innerHeight * 1.25,
  );
  return Promise.all(
    pending.map(
      (image) =>
        new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

function pageReady() {
  return Promise.race([
    Promise.all([windowLoaded(), document.fonts?.ready, imagesSettled()]),
    delay(MAX_WAIT_MS),
  ]);
}

const LOADING_CLASS = "is-page-loading";

/**
 * Runs `callback` once the loading screen has lifted (immediately if it is not
 * showing), so entrance animations play in view rather than behind it.
 * Returns a function that cancels the pending call.
 */
export function whenPageVisible(callback: () => void) {
  if (!document.documentElement.classList.contains(LOADING_CLASS)) {
    const timer = window.setTimeout(callback, 0);
    return () => window.clearTimeout(timer);
  }
  const onDone = () => callback();
  window.addEventListener("page-loader:done", onDone, { once: true });
  return () => window.removeEventListener("page-loader:done", onDone);
}

/**
 * A cobalt screen with a pulsing logo that covers the site on first load and
 * between pages, lifting only once the page's fonts and images are ready.
 */
export function PageLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const shownAt = useRef(0);
  const firstPath = useRef(true);

  // Expose the state to animations and announce when the page is revealed.
  useEffect(() => {
    document.documentElement.classList.toggle(LOADING_CLASS, active);
    if (!active) window.dispatchEvent(new Event("page-loader:done"));
  }, [active]);

  // First load or reload: the screen is already showing from the server render.
  useEffect(() => {
    let cancelled = false;
    shownAt.current = performance.now();
    Promise.all([pageReady(), delay(MIN_INITIAL_MS)]).then(() => {
      if (!cancelled) setActive(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Show the screen as soon as a link to another page is clicked.
  useEffect(() => {
    const show = () => {
      shownAt.current = performance.now();
      setActive(true);
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element | null)?.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download"))
        return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      show();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", show);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", show);
    };
  }, []);

  // When the new page has rendered, wait for its images, then lift the screen.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    let cancelled = false;
    const elapsed = performance.now() - shownAt.current;
    // Let the new page paint before collecting its images.
    window.requestAnimationFrame(() => {
      Promise.all([
        pageReady(),
        delay(Math.max(0, MIN_NAVIGATION_MS - elapsed)),
      ]).then(() => {
        if (!cancelled) setActive(false);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <div
      className={`page-loader ${active ? "is-active" : ""}`}
      role="status"
      aria-live="polite"
      aria-hidden={!active}
    >
      <Image
        className="page-loader-logo"
        src="/white.png"
        alt=""
        width={160}
        height={160}
        priority
      />
      <span className="sr-only">{active ? "Loading page" : ""}</span>
    </div>
  );
}
