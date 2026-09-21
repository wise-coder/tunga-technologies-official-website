export type Metric = {
  label: string;
  value: string | null;
  source?: string;
  period?: string;
  note?: string;
};

export const impactMetrics: Metric[] = [
  {
    label: "Solution launched",
    value: "01",
    source: "Tunga Technologies frontend handoff, September 2026",
    note: "e-tungo · Livestock marketplace",
    period: "September 2026",
  },
  { label: "Users reached", value: null },
  { label: "Districts represented", value: null },
  { label: "Marketplace connections", value: null },
  { label: "Organizations participating", value: null },
];

export const impactFramework = [
  {
    title: "Who benefits?",
    description: "Define the people, businesses or communities served.",
    detail: "Start with the people behind the numbers.",
  },
  {
    title: "What improves?",
    description:
      "Market access, time, cost, productivity, opportunity or service quality.",
    detail: "Understand the change a product makes possible.",
  },
  {
    title: "How do we know?",
    description:
      "Use product analytics, partner feedback and verified outcomes.",
    detail: "Connect every claim to evidence.",
  },
  {
    title: "Can it scale?",
    description:
      "Assess adoption, economics, partnerships and operational feasibility.",
    detail: "Grow with a clear understanding of what works.",
  },
];
