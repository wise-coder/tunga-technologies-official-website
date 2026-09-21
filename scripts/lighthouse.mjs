import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import { mkdir, writeFile } from "node:fs/promises";

// Manage Chrome with Playwright to avoid chrome-launcher's Windows temp cleanup issue.
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--remote-debugging-port=9223"],
});

try {
  const result = await lighthouse(
    process.env.AUDIT_URL || "http://localhost:3000",
    {
      port: 9223,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    },
  );
  if (!result) throw new Error("Lighthouse returned no report");
  await mkdir(".reference", { recursive: true });
  await writeFile(".reference/lighthouse-mobile.json", result.report[0]);
  await writeFile(".reference/lighthouse-mobile.html", result.report[1]);
  console.log(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [
          key,
          value.score,
        ]),
      ),
      null,
      2,
    ),
  );
  if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message);
} finally {
  await browser.close();
}
