import { expect, test } from "@playwright/test";

test("visitors can discover all six work tools and their development stages", async ({
  page,
}) => {
  await page.goto("/");
  const apps = page.getByRole("region", {
    name: "Apps for the work behind the work",
  });
  for (const name of [
    "spec-dude",
    "auth-dude",
    "training-dude",
    "crm-dude",
    "notedude",
    "todude",
  ]) {
    const app = apps
      .getByRole("article")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(app).toBeVisible();
    await expect(
      app.getByText(/Exploration|In development|Prototype/),
    ).toBeVisible();
    await expect(app.getByRole("link")).toHaveCount(0);
  }
  await expect(apps.getByText(/specification coverage/i)).toBeVisible();
  await expect(apps.getByText(/authorization/i)).toBeVisible();
  await expect(
    apps.locator(".ic-blurb").filter({ hasText: /walkthroughs/i }),
  ).toBeVisible();
});

test("navigation and native disclosures expose the methodology and separate approval gates", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Methodology" })
    .click();
  await expect(page).toHaveURL(/#methodology$/);
  const methodology = page.getByRole("region", { name: "SDLC Orchestration" });
  await expect(
    methodology.getByRole("heading", {
      name: "SDLC Orchestration",
      exact: true,
    }),
  ).toBeInViewport();
  const steps = methodology.locator("details");
  await expect(steps).toHaveCount(6);
  for (const step of await steps.all()) {
    if ((await step.getAttribute("open")) === null)
      await step.locator("summary").click();
    await expect(step.locator(".step-body")).toBeVisible();
  }
  await expect(methodology.getByText(/different\s+model/i)).toBeVisible();
  await expect(
    methodology.getByText(/tests before implementation/i),
  ).toBeVisible();
  await expect(methodology.getByText(/exact build/i)).toBeVisible();
  for (const name of [
    "Engineering approval",
    "QA acceptance",
    "Release authorization",
  ]) {
    await expect(
      methodology.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
});

test("concept sketches fit their frames on short narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  for (const frame of await page.locator(".pv:has(.sketch)").all()) {
    const bounds = await frame.evaluate((element) => {
      const frame = element.getBoundingClientRect();
      const sketch = element.querySelector(".sketch").getBoundingClientRect();
      return {
        top: sketch.top - frame.top,
        bottom: frame.bottom - sketch.bottom,
      };
    });
    expect(bounds.top).toBeGreaterThanOrEqual(0);
    expect(bounds.bottom).toBeGreaterThanOrEqual(0);
  }
});

test("the original client entries and product keyboard navigation remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const name of ["vendorbuddy", "algotrade", "predictmarket"]) {
    await expect(
      page
        .getByRole("region", { name: "Client work", exact: true })
        .getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  await page.keyboard.press("j");
  await expect(
    page.getByRole("article", { name: "spec-dude", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("j");
  await expect(
    page.getByRole("article", { name: "auth-dude", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("k");
  await expect(
    page.getByRole("article", { name: "spec-dude", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("9");
  await expect(
    page.getByRole("article", { name: "predictmarket", exact: true }),
  ).toBeFocused();
  const link = page
    .getByRole("navigation")
    .getByRole("link", { name: "auth-dude", exact: true });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#auth-dude$/);
  await expect(
    page.getByRole("article", { name: "auth-dude", exact: true }),
  ).toBeInViewport();
  expect(errors).toEqual([]);
});

test("keyboard users can skip to content and operate the methodology", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  // macOS WebKit uses Option-Tab to include links in native keyboard navigation.
  await page.keyboard.press(
    process.platform === "darwin" && browserName === "webkit"
      ? "Alt+Tab"
      : "Tab",
  );
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const step = page.locator("details").nth(1);
  await step.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(step).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(step).not.toHaveAttribute("open", "");
});

test("the page remains usable without JavaScript, with no broken local resources or links", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const failures = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(response.url());
  });
  await page.goto(baseURL);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "spec-dude", exact: true }),
  ).toBeVisible();
  for (const href of await page
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
    await expect(page.locator(href)).toHaveCount(1);
  }
  expect(failures).toEqual([]);
  await expect(
    page.getByRole("link", { name: "Request an invitation" }),
  ).toHaveAttribute("href", "https://forms.gle/t8tsXymPXJXixe5T6");
  await expect(
    page.getByRole("link", { name: "Book a conversation" }),
  ).toHaveAttribute("href", "/meet");
  await context.close();
});

test("the page fits narrow screens and zoom-sized layouts with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const step of await page.locator("details").all()) {
      if ((await step.getAttribute("open")) === null)
        await step.locator("summary").click();
    }
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
    expect(
      await page
        .locator("html")
        .evaluate((element) => getComputedStyle(element).scrollBehavior),
    ).toBe("auto");
  }
});
