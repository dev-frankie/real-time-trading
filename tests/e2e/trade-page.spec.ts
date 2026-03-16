import { expect, test, type Page } from "@playwright/test";

async function openOrderModal(page: Page): Promise<void> {
  const firstOrderbookRow = page.locator(".ag-center-cols-container .ag-row").first();
  await expect(firstOrderbookRow).toBeVisible();
  await firstOrderbookRow.click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test.describe("trade page e2e scenarios", () => {
  test("renders orderbook and opens modal on row click", async ({ page }) => {
    await page.goto("/trade");

    await expect(page).toHaveURL(/\/trade$/);
    await expect(
      page.getByRole("heading", {
        name: /Real-time Orderbook Trading System|실시간 호가 및 주문 시스템/,
      }),
    ).toBeVisible();

    await openOrderModal(page);
    await expect(
      page.getByRole("heading", {
        name: /Place Order|주문하기/,
      }),
    ).toBeVisible();
  });

  test("places order and navigates to complete page", async ({ page }) => {
    await page.goto("/trade");
    await openOrderModal(page);

    await page.getByRole("button", { name: /Buy|매수/ }).click();

    await expect(page).toHaveURL(/\/complete$/);
    await expect(
      page.getByRole("heading", {
        name: /Order completed\.|주문이 완료되었습니다\./,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/Order type|주문 타입/, {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("shows validation error when quantity exceeds stock", async ({ page }) => {
    await page.goto("/trade");
    await openOrderModal(page);

    await page.getByLabel(/Quantity|수량/).fill("999999");
    await page.getByRole("button", { name: /Buy|매수/ }).click();

    await expect(
      page.getByText(
        /Cannot exceed available quantity|잔량\(.*\)을 초과할 수 없습니다\./,
      ),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/trade$/);
  });

  test("switches language with toggle", async ({ page }) => {
    await page.goto("/trade");

    await page.getByRole("button", { name: "EN" }).click();
    await expect(
      page.getByRole("heading", {
        name: "Real-time Orderbook Trading System",
      }),
    ).toBeVisible();

    await page.getByRole("button", { name: "KR" }).click();
    await expect(
      page.getByRole("heading", {
        name: "실시간 호가 및 주문 시스템",
      }),
    ).toBeVisible();
  });

  test("shows fetch error first and recovers on retry", async ({ page }) => {
    await page.addInitScript(() => {
      const originalFetch = window.fetch.bind(window);
      let failedCount = 0;

      window.fetch = ((...args: Parameters<typeof fetch>) => {
        const [input] = args;
        const target = typeof input === "string" ? input : input.url;

        if (target.includes("/api/orderbook") && failedCount < 2) {
          failedCount += 1;
          return Promise.reject(new Error("forced orderbook failure"));
        }

        return originalFetch(...args);
      }) as typeof fetch;
    });

    await page.goto("/trade");

    await expect(
      page.getByText(
        /Failed to load orderbook data\.|호가 데이터를 불러오지 못했습니다\./,
      ),
    ).toBeVisible();

    await page.getByRole("button", { name: /Retry|재시도/ }).click();

    const firstOrderbookRow = page.locator(".ag-center-cols-container .ag-row").first();
    await expect(firstOrderbookRow).toBeVisible();
  });
});
