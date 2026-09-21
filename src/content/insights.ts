export type Insight = {
  slug: string;
  title: string;
  summary: string;
  category:
    "Product update" | "Field note" | "Case study" | "Company" | "Research";
  date: string;
  readTime: number;
  author: string;
  published: boolean;
  image?: { src: string; alt: string };
  sections: { heading: string; paragraphs: string[] }[];
};

// No fabricated articles. Add approved content here; unpublished entries never render.
export const insights: Insight[] = [];
export const publishedInsights = insights.filter(
  (insight) =>
    insight.published && new Date(insight.date).getTime() <= Date.now(),
);
