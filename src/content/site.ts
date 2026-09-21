export const site = {
  name: "Tunga Technologies",
  tagline: "Technology built for Rwanda’s progress.",
  description:
    "We turn real challenges into practical digital solutions that create opportunity and measurable impact.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
  email: process.env.COMPANY_EMAIL || "",
  phone: process.env.COMPANY_PHONE || "",
  socials: [
    { label: "LinkedIn", href: process.env.COMPANY_LINKEDIN_URL || "" },
    { label: "GitHub", href: process.env.COMPANY_GITHUB_URL || "" },
  ].filter((link) => /^https:\/\//.test(link.href)),
};

export const indexable =
  process.env.SITE_INDEXABLE === "true" &&
  site.url.startsWith("https://") &&
  process.env.VERCEL_ENV !== "preview";

// Insights is explicitly requested in the user's navigation. Its empty state is noindex.
export const navigation = [
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Impact", href: "/impact" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const processSteps = [
  {
    title: "Identify",
    description: "Understand a real problem before proposing technology.",
  },
  {
    title: "Validate",
    description: "Speak with users, institutions and affected communities.",
  },
  {
    title: "Build",
    description:
      "Create the smallest useful solution with excellent usability.",
  },
  {
    title: "Measure",
    description:
      "Track adoption, outcomes, user feedback and operational evidence.",
  },
  {
    title: "Scale",
    description: "Grow only what proves useful and sustainable.",
  },
];

export const values = [
  { title: "Practicality", description: "Useful beats impressive." },
  {
    title: "Accessibility",
    description: "Build for real people and real devices.",
  },
  {
    title: "Trust",
    description:
      "Be transparent about what is proven and what is still being tested.",
  },
  { title: "Impact", description: "Measure outcomes, not just launches." },
  {
    title: "Local relevance",
    description: "Start from Rwanda’s context while designing for scale.",
  },
];

export const partnershipTypes = [
  {
    title: "Pilot Partner",
    description: "Test a Tunga solution in a real organization or community.",
    detail: "Bring a real challenge and a setting where we can learn together.",
  },
  {
    title: "Distribution Partner",
    description: "Help useful solutions reach more people.",
    detail:
      "Connect products with relevant users, cooperatives, businesses or districts.",
  },
  {
    title: "Strategic Investor",
    description: "Support validated products that are ready to scale.",
    detail:
      "Explore products with evidence, traction and a clear path to sustainable growth.",
  },
  {
    title: "Technical Partner",
    description:
      "Provide infrastructure, integrations or technical collaboration.",
    detail:
      "Collaborate on data, payments, communications or specialist technology.",
  },
  {
    title: "Research / Learning Partner",
    description: "Support validation, evaluation and learning.",
    detail:
      "Help understand needs, evaluate outcomes and document the evidence.",
  },
];
