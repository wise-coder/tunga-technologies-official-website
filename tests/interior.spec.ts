import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/about",
  "/solutions",
  "/solutions/e-tungo",
  "/impact",
  "/partners",
  "/contact",
  "/insights",
  "/privacy",
  "/terms",
  "/missing-page",
];

for (const route of pages) {
  test(`${route} is readable and fits mobile, tablet and desktop`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator(".page-loader")).toBeHidden();
    await expect(page.locator(".interior-page h1")).toHaveCount(1);
    await expect(page.locator(".interior-page h1")).toBeVisible();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `overflow at ${width}px`,
      ).toBe(true);
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: testInfo.outputPath(`page-${width}.png`),
          fullPage: true,
        });
      }
    }
    const accessibility = await new AxeBuilder({ page })
      .include(".interior-page")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("inner-page scroll reveals work and stop for reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/about");
  await expect(page.locator(".page-loader")).toBeHidden();
  await expect(page.locator("h1")).toHaveAttribute(
    "data-motion-revealed",
    "true",
  );
  const lastValue = page.locator(".values-list > li").last();
  await lastValue.scrollIntoViewIfNeeded();
  await expect(lastValue).toHaveAttribute("data-motion-revealed", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(async () =>
      page
        .locator(".interior-page")
        .evaluate(
          (element) =>
            element
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running").length,
        ),
    )
    .toBe(0);
});

test("navigation to and from the landing page retains the correct style scope", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".interior-page")).toHaveCount(0);
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page.locator(".interior-page")).toHaveAttribute(
    "data-page",
    "/about",
  );
  await expect(page.locator(".page-loader")).toBeHidden();
  await page.getByRole("link", { name: "Tunga Technologies home" }).click();
  await expect(page.locator(".home-v2")).toBeVisible();
  await expect(page.locator(".interior-page")).toHaveCount(0);
  await expect(page.locator(".site-header")).toHaveClass(/header-home/);
});

test("mobile inner navigation opens, closes and reaches the enquiry form", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menu = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await page.goto("/partners?type=Technical%20Partner#enquiry");
  await expect(
    page.getByLabel("Partnership type", { exact: true }),
  ).toHaveValue("Technical Partner");
  await expect(
    page.getByRole("button", { name: "Send enquiry", exact: true }),
  ).toBeVisible();
});
