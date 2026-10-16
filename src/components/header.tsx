"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/content/site";
import { Wordmark } from "./brand";
import { ArrowSlideContent } from "./ui";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overLight, setOverLight] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const isHome = pathname === "/";
  useEffect(() => {
    let frame = 0;
    // Checks what sits behind the floating bar, so the glass can deepen its
    // tint over white sections where a pale bar would disappear.
    const isLightBehind = () => {
      const bar = headerRef.current?.querySelector(".header-bar");
      if (!bar) return false;
      const rect = bar.getBoundingClientRect();
      const y = rect.top + rect.height / 2;
      let light = 0;
      for (const ratio of [0.25, 0.5, 0.75]) {
        const x = rect.left + rect.width * ratio;
        const behind = document
          .elementsFromPoint(x, y)
          .find((element) => !headerRef.current?.contains(element));
        if (surfaceIsLight(behind)) light++;
      }
      return light >= 2;
    };
    const update = () => {
      frame = 0;
      const isScrolled = window.scrollY > 8;
      setScrolled(isScrolled);
      setOverLight(isScrolled && isLightBehind());
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  };
  const trapFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = dialog.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        dialog.current?.close();
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  const active = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  return (
    <>
      <header
        ref={headerRef}
        className={`site-header ${isHome ? "header-home" : ""} ${scrolled ? "is-scrolled" : ""} ${overLight ? "is-over-light" : ""}`}
      >
        <div className="header-bar">
          <div className="container header-inner">
            <Wordmark />
            <nav aria-label="Main navigation" className="desktop-nav">
              <Link href="/" aria-current={isHome ? "page" : undefined}>
                Home
              </Link>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link className="header-secondary" href="/solutions">
              Our solutions
            </Link>
            <Link className="header-cta" href="/partners">
              <ArrowSlideContent
                arrow={<ArrowUpRight size={17} aria-hidden="true" />}
                direction="up-right"
                animation="content-slide"
              >
                Partner With Us
              </ArrowSlideContent>
            </Link>
            <button
              className="menu-toggle"
              ref={trigger}
              type="button"
              aria-label="Open navigation"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => {
                dialog.current?.showModal();
                setOpen(true);
              }}
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
        <dialog
          id="mobile-navigation"
          className="mobile-menu"
          ref={dialog}
          onKeyDown={trapFocus}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            ) {
              close();
            }
          }}
          onClose={() => setOpen(false)}
          onCancel={close}
          aria-label="Mobile navigation"
        >
          <div className="mobile-menu-top">
            <span className="mobile-menu-title">Explore Tunga</span>
            <button
              className="menu-toggle"
              onClick={close}
              aria-label="Close navigation"
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile main navigation">
            <Link
              href="/"
              onClick={close}
              aria-current={isHome ? "page" : undefined}
            >
              <span className="menu-index">00</span>Home
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={active(item.href) ? "page" : undefined}
              >
                <span className="menu-index">0{index + 1}</span>
                {item.label}
                <ArrowUpRight size={22} aria-hidden="true" />
              </Link>
            ))}
            <Link
              href="/partners"
              onClick={close}
              className="button button-primary"
            >
              <ArrowSlideContent
                arrow={<ArrowUpRight size={18} aria-hidden="true" />}
                direction="up-right"
                animation="content-slide"
              >
                Partner With Us
              </ArrowSlideContent>
            </Link>
          </nav>
          <p className="mobile-menu-footer">
            Technology built for Rwanda’s progress.
          </p>
        </dialog>
      </header>
    </>
  );
}

// A surface counts as light when its first painted background is near white.
// Gradients and images (heroes, banners, the impact panel) count as dark.
function surfaceIsLight(element: Element | undefined) {
  for (let node = element; node; node = node.parentElement ?? undefined) {
    const style = getComputedStyle(node);
    if (style.backgroundImage !== "none") return false;
    const match = style.backgroundColor.match(/[\d.]+/g);
    if (!match) continue;
    const [r, g, b, a = 1] = match.map(Number);
    if (a < 0.5) continue;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.9;
  }
  return true;
}
