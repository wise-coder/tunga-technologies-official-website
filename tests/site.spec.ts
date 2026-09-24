import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/about",
  "/solutions",
  "/solutions/e-tungo",
  "/impact",
  "/insights",
  "/partners",
  "/contact",
  "/privacy",
  "/terms",
];

test("product explorer supports mouse and keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Discover", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Discover what’s available around you.",
  );
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Connect", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "From discovery to a direct conversation.",
  );
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Improve", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(page.getByRole("tabpanel")).toContainText(
    "Let the right buyers find you.",
  );
});

test("announcement toast pops on bottom scroll, dismisses and header changes after scrolling", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".site-header")).not.toHaveClass(/is-scrolled/);
  await expect(page.locator(".announcement")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(".site-header")).toHaveClass(/is-scrolled/);
  await expect(page.locator(".announcement")).toHaveCount(1);
  await page.getByRole("button", { name: "Dismiss announcement" }).click();
  await expect(page.locator(".announcement")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(".site-header")).not.toHaveClass(/is-scrolled/);
});

test("homepage questions expand with keyboard", async ({ page }) => {
  await page.goto("/");
  const question = page
    .locator(".faq-list details")
    .filter({ hasText: "How is e-tungo connected to Tunga?" });
  await expect(question).not.toHaveAttribute("open", "");
  await question.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("open", "");
  await expect(question.locator("p")).toBeVisible();
});

for (const route of routes) {
  test(`${route}: renders, metadata, links, accessibility and responsive layout`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Tunga Technologies/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(new URL(canonical!).href).toBe(`http://localhost:3000${route}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Tunga/,
    );
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
    const audit = await new AxeBuilder({ page })
      .options({ rules: { "label-content-name-mismatch": { enabled: true } } })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `horizontal overflow on ${route} at ${width}px`,
      ).toBe(true);
    }
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => [
        ...new Set(links.map((link) => link.getAttribute("href")!)),
      ]);
    for (const href of hrefs)
      expect(
        (await request.get(href)).status(),
        `broken internal link ${href}`,
      ).toBe(200);
    expect(errors).toEqual([]);
  });
}

test("mobile menu traps focus, closes with Escape and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest("dialog")),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await dialog.getByRole("link", { name: "Partner With Us" }).click();
  await expect(page).toHaveURL(/\/partners$/);
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("keyboard skip link and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  expect(
    await page
      .locator(".home-hero-copy")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
});

async function fillContact(page: import("@playwright/test").Page) {
  await page.getByLabel("Name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("Topic", { exact: true })
    .selectOption("General enquiry");
  await page
    .getByLabel("Message", { exact: true })
    .fill("This is a local automated test of the enquiry form.");
  await page.getByRole("checkbox").check();
}

test("contact validates fields and fails honestly when delivery is unconfigured", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText("Please enter your name (at least 2 characters)."),
  ).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await fillContact(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "has not been sent or saved",
  );
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue(
    "Test Visitor",
  );
});

test("contact loading and success states with a mocked delivery response", async ({
  page,
}) => {
  await page.route("**/api/enquiries", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Received (test only)" }),
    });
  });
  await page.goto("/contact");
  await fillContact(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sending your message…" }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toContainText(
    "Thank you for reaching out",
  );
  await expect(page.getByRole("status")).toBeFocused();
  await page.getByRole("button", { name: "Send another message" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
});

test("partnership cards preselect the enquiry type and organization is required", async ({
  page,
}) => {
  await page.goto("/partners");
  await page
    .locator(".partner-card")
    .filter({
      has: page.getByRole("heading", {
        name: "Technical Partner",
        exact: true,
      }),
    })
    .getByRole("link")
    .click();
  await expect(
    page.getByLabel("Partnership type", { exact: true }),
  ).toHaveValue("Technical Partner");
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByText("Please enter your organization.")).toBeVisible();
  await expect(
    page.getByText("Please enter your role or title."),
  ).toBeVisible();
  await page.getByLabel("Name", { exact: true }).fill("Test Partner");
  await page
    .getByLabel("Organization", { exact: true })
    .fill("Local test organization");
  await page.getByLabel("Role / title", { exact: true }).fill("Test role");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("What would you like to explore?", { exact: true })
    .fill("A local automated test of the partnership enquiry form.");
  await page.getByRole("checkbox").check();
  await page.route("**/api/enquiries", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        message: "We couldn’t confirm delivery. Please try again shortly.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "couldn’t confirm delivery",
  );
});

test("API rejects invalid, cross-origin and oversized requests", async ({
  request,
}) => {
  expect((await request.post("/api/enquiries", { data: {} })).status()).toBe(
    400,
  );
  expect(
    (
      await request.post("/api/enquiries", {
        data: {},
        headers: { origin: "https://unrelated.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/enquiries", {
        data: { message: "a".repeat(21000) },
      })
    ).status(),
  ).toBe(413);
  expect(
    (
      await request.post("/api/enquiries", {
        data: "hello",
        headers: { "content-type": "text/plain" },
      })
    ).status(),
  ).toBe(415);
});

test("404s, SEO assets, no fake articles and external platform destination", async ({
  page,
  request,
}) => {
  expect((await request.get("/insights/nonexistent-article")).status()).toBe(
    404,
  );
  expect((await request.get("/does-not-exist")).status()).toBe(404);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/icon.svg")).status()).toBe(200);
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  await page.goto("/solutions/e-tungo");
  const platform = page
    .getByRole("link", {
      name: "Visit e-tungo (opens in a new tab)",
      exact: true,
    })
    .first();
  await expect(platform).toHaveAttribute(
    "href",
    "https://e-tungo.tungatechnologies.com/",
  );
  await expect(platform).toHaveAttribute("rel", "noopener noreferrer");
  await page.goto("/insights");
  await expect(page.locator(".insight-card")).toHaveCount(0);
  await expect(
    page.getByText("Our next chapter is taking shape."),
  ).toBeVisible();
});
