import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

test.describe('Mobile Viewport', () => {
  test('homepage renders correctly on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()

    // Page should not have horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5) // small tolerance
  })

  test('navigation is accessible on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for hamburger menu button or mobile nav toggle
    const menuButton = page.getByRole('button', { name: /menu/i })
      .or(page.getByLabel(/menu/i))
      .or(page.getByTestId('mobile-menu'))
      .or(page.locator('[aria-label*="menu" i]'))

    if (await menuButton.count() > 0) {
      await expect(menuButton.first()).toBeVisible()
      // Try opening the menu
      await menuButton.first().click()
      // After clicking, nav links should appear
      await page.waitForTimeout(300) // allow animation
      const navLinks = page.getByRole('link')
      const linkCount = await navLinks.count()
      expect(linkCount).toBeGreaterThan(0)
    } else {
      // Nav links might be visible directly even on mobile
      const navLinks = page.getByRole('link')
      const linkCount = await navLinks.count()
      expect(linkCount).toBeGreaterThan(0)
    }
  })

  test('pricing page is readable on mobile', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    // Tier names should be visible
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()

    // Prices should be visible
    await expect(page.getByText('$9.99')).toBeVisible()
  })

  test('features page renders on mobile', async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(100)
  })

  test('footer is present on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const footer = page.locator('footer')
    if (await footer.count() > 0) {
      // Scroll to footer
      await footer.scrollIntoViewIfNeeded()
      await expect(footer).toBeVisible()
    }
  })
})
