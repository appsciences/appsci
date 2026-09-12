import { expect, test } from "@playwright/test";

test("returning visitors bypass a cached unversioned stylesheet", async ({
  page,
}) => {
  // Model a returning browser that still has the pre-release stylesheet cached.
  await page.route(/\/styles\.css$/, (route) =>
    route.fulfill({
      contentType: "text/css",
      body: "/* The earlier stylesheet has no community promotion styles. */",
    }),
  );
  await page.goto("/");
  const community = page.getByRole("region", {
    name: "AI is the new UI.",
    exact: true,
  });
  await expect(community).toHaveCSS("display", "grid");
  const headingSizes = await community.evaluate((element) => ({
    promotion: parseFloat(
      getComputedStyle(element.querySelector("h2")).fontSize,
    ),
    brand: parseFloat(getComputedStyle(document.querySelector("h1")).fontSize),
  }));
  expect(headingSizes.promotion).toBeGreaterThan(headingSizes.brand);
});
