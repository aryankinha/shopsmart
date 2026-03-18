import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// E2E Tests — ShopSmart Storefront
// ---------------------------------------------------------------------------

const products = [
  {
    _id: 'p1',
    name: 'Wireless Headphones',
    price: 79.99,
    imageUrl: 'https://picsum.photos/seed/e2e-headphones/400/300',
    category: 'Audio',
    stock: 12,
  },
  {
    _id: 'p2',
    name: 'USB-C Cable',
    price: 12.99,
    imageUrl: 'https://picsum.photos/seed/e2e-cable/400/300',
    category: 'Accessories',
    stock: 30,
  },
  {
    _id: 'p3',
    name: 'Phone Case',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/e2e-phone-case/400/300',
    category: 'Accessories',
    stock: 20,
  },
  {
    _id: 'p4',
    name: 'Screen Protector',
    price: 9.99,
    imageUrl: 'https://picsum.photos/seed/e2e-screen/400/300',
    category: 'Accessories',
    stock: 0,
  },
  {
    _id: 'p5',
    name: 'Portable Charger',
    price: 49.99,
    imageUrl: 'https://picsum.photos/seed/e2e-charger/400/300',
    category: 'Power',
    stock: 18,
  },
  {
    _id: 'p6',
    name: 'Bluetooth Speaker',
    price: 59.99,
    imageUrl: 'https://picsum.photos/seed/e2e-speaker/400/300',
    category: 'Audio',
    stock: 15,
  },
]

test.describe('ShopSmart Storefront', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: products,
          count: products.length,
        }),
      })
    })

    await page.route('**/api/products/*', async (route) => {
      const id = route.request().url().split('/').pop()
      const product = products.find((item) => item._id === id)

      if (!product) {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Product not found' }),
        })
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: product }),
      })
    })

    await page.goto('/')
  })

  // ---- Page Load ----------------------------------------------------------
  test('page loads with ShopSmart branding', async ({ page }) => {
    await expect(page.locator('.navbar-logo')).toHaveText('ShopSmart')
  })

  test('navbar contains home/products/cart links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible()
    await expect(page.locator('.cart-link')).toBeVisible()
  })

  // ---- Home ---------------------------------------------------------------
  test('home page shows hero and featured products', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Discover Products You'll Love/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Featured Products' })).toBeVisible()
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('.product-card')).toHaveCount(4)
  })

  test('shop now button navigates to products page', async ({ page }) => {
    await page.getByRole('button', { name: 'Shop Now' }).click()
    await expect(page.getByPlaceholder('Search products...')).toBeVisible()
  })

  // ---- Products -----------------------------------------------------------
  test('products page shows all products and search', async ({ page }) => {
    await page.getByRole('link', { name: 'Products' }).click()
    await expect(page.getByPlaceholder('Search products...')).toBeVisible()

    const cards = page.locator('.product-card')
    await expect(cards).toHaveCount(6) // server returns 6 products
  })

  test('products page supports add to cart and out-of-stock state', async ({ page }) => {
    await page.getByRole('link', { name: 'Products' }).click()

    const addButtons = page.getByRole('button', { name: 'Add to Cart' })
    await expect(addButtons.first()).toBeVisible()
    await expect(addButtons.first()).toBeEnabled()

    const outOfStock = page.getByRole('button', { name: 'Out of Stock' })
    await expect(outOfStock.first()).toBeVisible()
    await expect(outOfStock.first()).toBeDisabled()
  })

  test('footer shows copyright', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('© 2025 ShopSmart')
  })

  // ---- Navigation ---------------------------------------------------------
  test('cart icon opens cart drawer', async ({ page }) => {
    await page.locator('.cart-link').click()
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible()
    await expect(page.getByText('Your cart is empty.')).toBeVisible()
  })

  test('cart route renders cart page', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible()

    await expect(page.getByText('Your cart is empty.')).toBeVisible()
  })

  // ---- Visual / Layout ----------------------------------------------------
  test('page has correct semantic structure', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})
