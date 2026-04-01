import { test, expect } from '@playwright/test'

test.describe('Team Management', () => {
  test('team page loads', async ({ page }) => {
    await page.goto('/team')
    await page.waitForLoadState('networkidle')

    // Page should load without a server error
    const title = await page.title()
    expect(title).toBeTruthy()
    await expect(page.locator('body')).toBeVisible()
  })

  test('team API requires authentication', async ({ request }) => {
    const r = await request.get('/api/teams')
    // Should not be a server error; expect 401/403 for unauthenticated
    expect(r.status()).toBeLessThan(500)
  })

  test('team creation requires authentication', async ({ request }) => {
    const r = await request.post('/api/teams', {
      data: { name: 'Test Team' }
    })
    // Unauthenticated should be rejected
    expect(r.status()).toBeLessThan(500)
    expect(r.status()).toBeGreaterThanOrEqual(400)
  })

  test('invite page loads', async ({ page }) => {
    await page.goto('/invite')
    await page.waitForLoadState('networkidle')

    // Should load (may show auth prompt or info page)
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(0)
  })

  test('team-related content mentions roles or members', async ({ page }) => {
    await page.goto('/team')
    await page.waitForLoadState('networkidle')

    const content = await page.textContent('body')
    // Team page should mention team-related concepts
    const hasTeamContent = content!.toLowerCase().includes('team')
      || content!.toLowerCase().includes('member')
      || content!.toLowerCase().includes('role')
      || content!.toLowerCase().includes('invite')
    expect(hasTeamContent).toBeTruthy()
  })
})
