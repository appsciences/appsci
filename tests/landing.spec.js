import { expect, test } from "@playwright/test";

test("visitors can discover all seven work tools and their development stages", async ({
  page,
}) => {
  await page.goto("/");
  const apps = page.getByRole("region", {
    name: "Apps for the work behind the work",
  });
  for (const name of [
    "sdlc-dude",
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
    await expect(app.locator(".ic-blurb")).toHaveCount(1);
  }
});

test("all ten projects have a one-line description and a more info link to nbino.studio", async ({
  page,
}) => {
  await page.goto("/");
  const projects = page.locator("#apps article, #client-work article");
  await expect(projects).toHaveCount(10);
  for (const project of await projects.all()) {
    await expect(project.locator(".ic-blurb")).toHaveCount(1);
    await expect(project.locator(".assistant-native")).toHaveCount(0);
    await expect(project.getByRole("link")).toHaveCount(1);
    await expect(project.locator(".pvwrap")).toHaveCount(0);
    const anchors = {
      "auth-dude": "#auth-dude",
      notedude: "#note-dude",
      todude: "#to-dude",
    };
    const id = await project.getAttribute("id");
    await expect(
      project.getByRole("link", { name: "More info", exact: true }),
    ).toHaveAttribute("href", `https://nbino.studio/${anchors[id] ?? ""}`);
  }
});

test("the hero title and subtitle state the delivery path", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Discovery → AI SDLC → Production",
  );
  await expect(page.locator(".hero > .subtitle")).toHaveText(
    "AI SDLC Orchestration Rockstars",
  );
});

test("a community section lists postui.org after client work and joins keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  const community = page.getByRole("region", {
    name: "Community",
    exact: true,
  });
  const entry = community.getByRole("article", {
    name: "postui.org",
    exact: true,
  });
  await expect(entry).toBeVisible();
  await expect(entry).toHaveAttribute("data-path", "~/community/postui.org");
  await expect(entry).toContainText("working group");
  await expect(entry).toContainText("teardowns");
  await expect(entry).toContainText("pilots");
  await expect(
    entry.getByRole("link", { name: "Visit postui.org" }),
  ).toHaveAttribute("href", "https://postui.org/");
  await expect(
    entry.getByRole("link", { name: "Read the manifesto" }),
  ).toHaveAttribute("href", "https://postui.org/manifesto");

  const order = await page.evaluate(() =>
    ["client-work", "community-projects", "methodology"].map(
      (id) => document.getElementById(id).getBoundingClientRect().top,
    ),
  );
  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);

  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav).toContainText("community/");
  await expect(
    nav.getByRole("link", { name: "postui.org", exact: true }),
  ).toHaveAttribute("href", "#postui-org");

  // From a fresh page, k wraps to methodology; the next k lands on the community entry.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("k");
  await page.keyboard.press("k");
  await expect(entry).toBeFocused();
});

test("PostUI community leads the page with prominent type and a grounded manifesto summary", async ({
  page,
}) => {
  await page.goto("/");
  const community = page.getByRole("region", {
    name: "AI is the new UI.",
    exact: true,
  });
  const headline = community.getByRole("heading", {
    name: "AI is the new UI.",
    exact: true,
  });
  await expect(headline).toBeInViewport();
  await expect(
    community.getByRole("link", { name: "Explore postui.org" }),
  ).toHaveAttribute("href", "https://postui.org/");
  await expect(
    community.getByRole("link", { name: "Read the manifesto" }),
  ).toHaveAttribute("href", "https://postui.org/manifesto");
  await expect(community).toContainText("Join the assistant-native community");
  await expect(community).toContainText("state what you want");
  await expect(community).toContainText("visual interfaces");
  await expect(community).toContainText("permissions");
  const placement = await community.evaluate((element) => ({
    beforeApps: !!(
      element.compareDocumentPosition(document.getElementById("apps")) &
      Node.DOCUMENT_POSITION_FOLLOWING
    ),
    fontSize: parseFloat(
      getComputedStyle(element.querySelector("h2")).fontSize,
    ),
    brandSize: parseFloat(
      getComputedStyle(document.querySelector("h1")).fontSize,
    ),
  }));
  expect(placement.beforeApps).toBe(true);
  expect(placement.fontSize).toBeGreaterThan(placement.brandSize);
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

test("the shortcut bar advertises only keys the page implements", async ({
  page,
}) => {
  await page.goto("/");
  const bar = page.getByRole("group", { name: "Keyboard shortcuts" });
  await expect(bar).toContainText("move");
  await expect(bar).toContainText("jump");
  // The bar used to promise "follow link", which nothing implemented: j/k focus an
  // <article tabindex="-1">, not a link, and the items carry no per-item destination.
  // See #22 — the bar and the handler must not drift apart again.
  await expect(bar).not.toContainText("follow link");

  // Enter on a focused item must stay inert rather than navigating somewhere invented.
  await page.keyboard.press("j");
  const first = page.getByRole("article", { name: "sdlc-dude", exact: true });
  await expect(first).toBeFocused();
  const before = page.url();
  await page.keyboard.press("Enter");
  expect(page.url()).toBe(before);
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
    page.getByRole("article", { name: "sdlc-dude", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("j");
  await expect(
    page.getByRole("article", { name: "spec-dude", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("k");
  await expect(
    page.getByRole("article", { name: "sdlc-dude", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("9");
  await expect(
    page.getByRole("article", { name: "algotrade", exact: true }),
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
  await expect(
    page.getByRole("heading", { name: "AI is the new UI.", exact: true }),
  ).toBeVisible();
  await expect(page.locator("article .ic-blurb")).toHaveCount(11);
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
