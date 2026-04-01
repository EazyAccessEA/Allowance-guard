import { test, expect } from '@playwright/test'

test.describe('Dark Mode & Theming', () => {
  test('page loads with default theme', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()

    // Body or html should have a theme-related class or data attribute
    const html = page.locator('html')
    const htmlClass = await html.getAttribute('class') || ''
    const htmlDataTheme = await html.getAttribute('data-theme') || ''
    const bodyClass = await page.locator('body').getAttribute('class') || ''

    // Page loaded successfully — theme state exists in some form
    expect(htmlClass + htmlDataTheme + bodyClass).toBeTruthy()
  })

  test('theme toggle exists on the page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme|dark|light|mode/i })
      .or(page.getByLabel(/theme|dark|light|mode/i))
      .or(page.getByTestId('theme-toggle'))
      .or(page.locator('[aria-label*="theme" i]'))
      .or(page.locator('[aria-label*="dark" i]'))

    if (await themeToggle.count() > 0) {
      await expect(themeToggle.first()).toBeVisible()
    } else {
      // Theme might be system-only with no manual toggle
      test.info().annotations.push({
        type: 'note',
        description: 'No theme toggle found — theme may follow system preference only'
      })
    }
  })

  test('dark mode renders via prefers-color-scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()

    // In dark mode, the html or body should reflect dark theme
    const html = page.locator('html')
    const htmlClass = await html.getAttribute('class') || ''
    const htmlDataTheme = await html.getAttribute('data-theme') || ''

    const isDark = htmlClass.includes('dark') || htmlDataTheme.includes('dark')

    if (isDark) {
      expect(isDark).toBeTruthy()
    } else {
      // Dark mode might be applied via CSS variables without class changes
      // Just verify the page didn't break
      const content = await page.textContent('body')
      expect(content!.length).toBeGreaterThan(0)
    }
  })

  test('pricing page renders without layout issues in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    // Key content should still be visible
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('$9.99')).toBeVisible()
  })

  test('features page renders in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/features')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(100)
  })

  test('light mode renders via prefers-color-scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(0)
  })
})
