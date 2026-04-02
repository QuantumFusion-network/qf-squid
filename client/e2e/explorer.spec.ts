import { expect, test } from "@playwright/test"

const SECURE_HASH = "0x1111111111111111111111111111111111111111111111111111111111111111"
const FINALIZED_ID = "0048833571-94a1a-000002"

test("search by hash renders multi-transfer detail page", async ({ page }) => {
  await page.goto("/")

  await page.getByLabel("Search transfer").fill(SECURE_HASH)
  await page.getByRole("button", { name: "Search" }).click()

  await expect(page.getByText("Overview")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Transfer details" }).last()).toBeVisible()
  await expect(page.getByTestId("result-badge")).toHaveText("Success")
  await expect(page.getByText("Block", { exact: true })).toBeVisible()
  await expect(page.getByTestId("transfer-card")).toHaveCount(2)
})

test("search by id shows transfer overview", async ({ page }) => {
  await page.goto(`/tx/${FINALIZED_ID}`)

  await expect(page.getByTestId("result-badge")).toHaveText("Success")
  await expect(page.getByText("Internal ID")).toBeVisible()
  await expect(page.getByText("Transaction hash")).toBeVisible()
})

test("shows not found state for missing transfer", async ({ page }) => {
  await page.goto("/tx/unknown-transfer-id")

  await expect(page.getByText("Transfer not found")).toBeVisible()
})
