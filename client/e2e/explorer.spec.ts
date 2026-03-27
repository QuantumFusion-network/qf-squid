import { expect, test } from "@playwright/test"

const FINALIZED_HASH = "0x1111111111111111111111111111111111111111111111111111111111111111"
const PENDING_ID = "0048833571-94a1a-000002"
const UNAVAILABLE_HASH = "0x3333333333333333333333333333333333333333333333333333333333333333"

test("search by hash renders multi-transfer detail page", async ({ page }) => {
  await page.goto("/")

  await page.getByLabel("Search transfer").fill(FINALIZED_HASH)
  await page.getByRole("button", { name: "Search" }).click()

  await expect(page.getByText("Overview")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Transfer details" }).last()).toBeVisible()
  await expect(page.getByTestId("finality-badge")).toHaveText("Securely finalized")
  await expect(page.getByTestId("transfer-card")).toHaveCount(2)
})

test("search by id shows pending finality and refresh can promote it", async ({ page }) => {
  await page.goto(`/tx/${PENDING_ID}`)

  await expect(page.getByTestId("finality-badge")).toHaveText("Pending secure finality")
  await page.getByRole("button", { name: "Refresh finality" }).click()
  await expect(page.getByTestId("finality-badge")).toHaveText("Securely finalized")
})

test("shows not found state for missing transfer", async ({ page }) => {
  await page.goto("/tx/unknown-transfer-id")

  await expect(page.getByText("Transfer not found")).toBeVisible()
})

test("shows unavailable finality when rpc data cannot be loaded", async ({ page }) => {
  await page.goto(`/tx/${UNAVAILABLE_HASH}`)

  await expect(page.getByTestId("finality-badge")).toHaveText("Unavailable")
})
