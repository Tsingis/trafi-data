import { test, expect } from "@playwright/test"

test("Basic test", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await expect(page).toHaveTitle("Home")

  const heading = page.locator("h1:first-of-type")
  await expect(heading).toBeVisible()

  const dropdown = page.locator(".dropdown-input")
  await expect(dropdown).toBeVisible()
 
  const dropdownInput = dropdown.locator("input")
  await expect(dropdownInput).toBeEditable()
})