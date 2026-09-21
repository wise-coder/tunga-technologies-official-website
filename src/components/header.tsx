"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/content/site";
import { Wordmark } from "./brand";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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
    <header className="site-header">
      <div className="container header-inner">
        <Wordmark />
        <nav aria-label="Main navigation" className="desktop-nav">
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
        <Link className="header-cta" href="/partners">
          Partner With Us
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
            Partner With Us
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </nav>
        <p className="mobile-menu-footer">
          Technology built for Rwanda’s progress.
        </p>
      </dialog>
    </header>
  );
}
