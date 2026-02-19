import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// E2E Tests — ShopSmart Dashboard
// ---------------------------------------------------------------------------

test.describe('ShopSmart Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ---- Page Load ----------------------------------------------------------
  test('page loads with ShopSmart branding', async ({ page }) => {
    await expect(page.locator('.navbar-brand h1')).toHaveText('ShopSmart')
  })

  test('navbar contains all navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  // ---- Products -----------------------------------------------------------
  test('products load and display on the dashboard', async ({ page }) => {
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10_000 })

    const cards = page.locator('.product-card')
    await expect(cards).toHaveCount(6) // server returns 6 products
  })

  test('product cards show name, price, and stock status', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Wireless Headphones' })).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('.price').first()).toBeVisible()
    await expect(page.locator('.stock-status.in-stock').first()).toBeVisible()
  })

  test('out-of-stock product shows unavailable button', async ({ page }) => {
    // Screen Protector is out of stock
    const card = page.locator('.product-card', { hasText: 'Screen Protector' })
    await expect(card).toBeVisible({ timeout: 10_000 })
    await expect(card.locator('.stock-status.out-of-stock')).toBeVisible()

    const btn = card.getByRole('button', { name: /unavailable/i })
    await expect(btn).toBeVisible()
    await expect(btn).toBeDisabled()
  })

  test('in-stock product has enabled Add to Cart button', async ({ page }) => {
    const card = page.locator('.product-card', { hasText: 'Wireless Headphones' })
    await expect(card).toBeVisible({ timeout: 10_000 })
    const btn = card.getByRole('button', { name: /add to cart/i })
    await expect(btn).toBeVisible()
    await expect(btn).toBeEnabled()
  })

  test('product count badge matches number of products', async ({ page }) => {
    await expect(page.locator('.product-count')).toContainText('6 Products Available', {
      timeout: 10_000,
    })
  })

  // ---- Backend Status (Footer) -------------------------------------------
  test('footer shows backend online status', async ({ page }) => {
    await expect(page.locator('.status-indicator.status-ok')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('.status-message')).toContainText('ShopSmart Backend is running')
  })

  test('footer shows copyright', async ({ page }) => {
    await expect(page.locator('.footer-info')).toContainText('2026 ShopSmart')
  })

  // ---- Navigation ---------------------------------------------------------
  test('user can click Sign In button', async ({ page }) => {
    const btn = page.getByRole('button', { name: /sign in/i })
    await btn.click()
    // No navigation yet, just verify it doesn't crash
    await expect(btn).toBeVisible()
  })

  test('user can click navigation links', async ({ page }) => {
    await page.getByRole('link', { name: 'Categories' }).click()
    await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible()

    await page.getByRole('link', { name: 'Cart' }).click()
    await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible()
  })

  // ---- Visual / Layout ----------------------------------------------------
  test('page has correct semantic structure', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})
