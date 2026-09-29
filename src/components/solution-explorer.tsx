"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Sprout,
} from "lucide-react";
import { etungo, productSteps } from "@/content/solutions";
import { BlurText } from "./blur-text";

const features = [
  {
    title: "Let the right buyers find you.",
    points: [
      "Photos that show what’s available",
      "A clear price and location",
      "A simple way to start a conversation",
    ],
  },
  {
    title: "Discover what’s available around you.",
    points: [
      "Animals and animal products",
      "Useful information in one place",
      "Connections across Rwanda",
    ],
  },
  {
    title: "From discovery to a direct conversation.",
    points: [
      "Contact sellers by phone",
      "Connect through WhatsApp",
      "Discuss the details directly",
    ],
  },
  {
    title: "A better marketplace starts with listening.",
    points: [
      "Learn from marketplace activity",
      "Listen to community feedback",
      "Improve around real needs",
    ],
  },
];

export function SolutionExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const feature = features[selected];
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % features.length
        : event.key === "ArrowLeft"
          ? (index - 1 + features.length) % features.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? features.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }
  return (
    <div className="solution-explorer">
      <div
        role="tablist"
        aria-label="How e-tungo works"
        className="solution-tabs"
      >
        {productSteps.map((step, index) => (
          <button
            key={step.title}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            id={`solution-tab-${index}`}
            role="tab"
            type="button"
            aria-selected={selected === index}
            aria-controls="solution-panel"
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {step.title}
          </button>
        ))}
      </div>
      <div
        id="solution-panel"
        role="tabpanel"
        aria-labelledby={`solution-tab-${selected}`}
        tabIndex={0}
        className="solution-panel"
      >
        <div className="solution-panel-copy">
          <span className="explorer-product">
            <Sprout size={22} aria-hidden="true" />
            e-tungo<span className="status-pill">Live</span>
          </span>
          <BlurText
            as="h3"
            text={feature.title}
            triggerKey={selected}
            delay={30}
            stepDuration={32}
            direction="bottom"
          />
          <BlurText
            as="p"
            text={productSteps[selected].description}
            triggerKey={selected}
            delay={130}
            stepDuration={24}
            direction="bottom"
          />
          <ul>
            {feature.points.map((point, index) => (
              <li key={point}>
                <Check size={17} aria-hidden="true" />
                <BlurText
                  text={point}
                  triggerKey={selected}
                  delay={230 + index * 95}
                  stepDuration={30}
                  direction="bottom"
                />
              </li>
            ))}
          </ul>
          <a
            href={etungo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Visit e-tungo
            <ArrowUpRight size={17} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="explorer-art">
          <div className="explorer-site-preview">
            <Image
              src="/e-tungo image.png"
              alt="e-tungo marketplace with animal and animal product listings"
              width={1448}
              height={1086}
              sizes="(max-width: 767px) calc(100vw - 72px), 410px"
              priority
            />
          </div>
        </div>
      </div>
      <p className="explorer-attribution">
        e-tungo is a product of Tunga Technologies.
      </p>
    </div>
  );
}
