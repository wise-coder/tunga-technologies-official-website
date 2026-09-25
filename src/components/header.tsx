"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/content/site";
import { Wordmark } from "./brand";
import { SlideText } from "./ui";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isHome = pathname === "/";
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (isHome && !dismissed) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const distanceToBottom = documentHeight - (scrollTop + windowHeight);
        const footerBottom = document.querySelector(".footer-bottom");
        const footerBottomReached = footerBottom
          ? footerBottom.getBoundingClientRect().top <= windowHeight - 10
          : false;
        const reachedFooterBase = distanceToBottom <= 80 || footerBottomReached;
        if (reachedFooterBase) {
          setToastVisible(true);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, dismissed]);
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
        className={`site-header ${isHome ? "header-home" : ""} ${scrolled ? "is-scrolled" : ""}`}
      >
        <div className="header-bar">
          <div className="header-inner">
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
            <SlideText>Partner With Us</SlideText>
            <ArrowUpRight size={17} aria-hidden="true" />
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
            <SlideText>Partner With Us</SlideText>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </nav>
        <p className="mobile-menu-footer">
          Technology built for Rwanda’s progress.
        </p>
      </dialog>
    </header>
      {isHome && toastVisible && !dismissed && (
        <aside
          className="announcement announcement-toast"
          role="region"
          aria-label="Announcement"
        >
          <div className="announcement-toast-inner">
            <p>Meet e-tungo. Connecting Rwanda’s livestock marketplace.</p>
            <div className="announcement-actions">
              <Link href="/solutions/e-tungo" className="announcement-cta">
                Discover e-tungo
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="announcement-dismiss"
                aria-label="Dismiss announcement"
                onClick={() => {
                  setDismissed(true);
                  setToastVisible(false);
                }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
