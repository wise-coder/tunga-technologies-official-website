export type Solution = {
  slug: string;
  name: string;
  status: "Live" | "Pilot";
  category: string;
  description: string;
  problem: string;
  url: string;
};

export const solutions: Solution[] = [
  {
    slug: "e-tungo",
    name: "e-tungo",
    status: "Live",
    category: "Agriculture & market access",
    description:
      "A simple digital marketplace for animals and animal products, connecting livestock farmers, sellers and buyers across Rwanda.",
    problem:
      "Livestock supply and demand can be fragmented and difficult to discover.",
    url: "https://e-tungo.tungatechnologies.com/",
  },
];
export const etungo = solutions[0];

export const productSteps = [
  {
    title: "Post",
    description:
      "Sellers create simple listings with photos, price and location.",
  },
  {
    title: "Discover",
    description: "Buyers browse animals and animal products.",
  },
  {
    title: "Connect",
    description: "Buyers call or contact sellers directly through WhatsApp.",
  },
  {
    title: "Improve",
    description:
      "Marketplace activity and community feedback help improve the solution.",
  },
];

export const selectionCriteria = [
  {
    title: "Real need",
    description: "The problem affects people, businesses or communities.",
  },
  {
    title: "Simple path",
    description: "Technology can make the process meaningfully easier.",
  },
  {
    title: "Measurable value",
    description: "The improvement can be defined and tracked.",
  },
  {
    title: "Responsible scaling",
    description: "The solution can be operated safely and sustainably.",
  },
];

// Add only real, approved screenshots. Empty slots are described honestly on the product page.
export const productScreenshots: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}[] = [];
