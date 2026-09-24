"use client";
import { useEffect } from "react";
import Link from "next/link";
import { SlideText } from "@/components/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page rendering error", error.digest || "unknown");
  }, [error]);
  return (
    <section className="error-page">
      <div className="container">
        <h1>Something didn’t load.</h1>
        <p>
          Please try again. If the problem continues, return to the homepage.
        </p>
        <div className="button-row">
          <button className="button button-primary" onClick={reset}>
            <SlideText>Try again</SlideText>
          </button>
          <Link href="/" className="button button-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
