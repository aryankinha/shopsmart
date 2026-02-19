import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Dashboard from './Dashboard'
import { server } from './mocks/server'
import { http, HttpResponse } from 'msw'

// ---------------------------------------------------------------------------
// Unit Tests — Dashboard Component
// ---------------------------------------------------------------------------
describe('Dashboard Component', () => {
  // ---- Loading State ------------------------------------------------------
  describe('Loading State', () => {
    it('shows loading message while fetching products', () => {
      server.use(
        http.get('/api/products', async () => {
          await new Promise((r) => setTimeout(r, 5000))
          return HttpResponse.json({ success: true, data: [] })
        }),
      )
      render(<Dashboard />)
      expect(screen.getByText(/loading products/i)).toBeInTheDocument()
    })

    it('loading message has correct class', () => {
      server.use(
        http.get('/api/products', async () => {
          await new Promise((r) => setTimeout(r, 5000))
          return HttpResponse.json({ success: true, data: [] })
        }),
      )
      render(<Dashboard />)
      expect(screen.getByText(/loading products/i)).toHaveClass('loading')
    })
  })

  // ---- Successful Render --------------------------------------------------
  describe('Successful Render', () => {
    it('renders dashboard header', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/product dashboard/i)).toBeInTheDocument()
      })
    })

    it('shows correct product count', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/3 products available/i)).toBeInTheDocument()
      })
    })

    it('renders all products from API', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
        expect(screen.getByText('USB-C Cable')).toBeInTheDocument()
        expect(screen.getByText('Screen Protector')).toBeInTheDocument()
      })
    })

    it('displays product prices', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('$79.99')).toBeInTheDocument()
        expect(screen.getByText('$12.99')).toBeInTheDocument()
        expect(screen.getByText('$9.99')).toBeInTheDocument()
      })
    })

    it('displays product descriptions', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(
          screen.getByText(/high-quality wireless headphones/i),
        ).toBeInTheDocument()
      })
    })
  })

  // ---- Stock Status -------------------------------------------------------
  describe('Stock Status', () => {
    it('shows "In Stock" for available products', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        const inStockBadges = screen.getAllByText(/✓ In Stock/i)
        expect(inStockBadges.length).toBeGreaterThan(0)
      })
    })

    it('shows "Out of Stock" for unavailable products', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/✗ Out of Stock/i)).toBeInTheDocument()
      })
    })

    it('applies out-of-stock class to unavailable product cards', async () => {
      const { container } = render(<Dashboard />)
      await waitFor(() => {
        const outOfStockCards = container.querySelectorAll(
          '.product-card.out-of-stock',
        )
        expect(outOfStockCards.length).toBe(1) // Screen Protector
      })
    })
  })

  // ---- Add to Cart Button ------------------------------------------------
  describe('Add to Cart Button', () => {
    it('renders "Add to Cart" for in-stock products', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        const addButtons = screen.getAllByRole('button', {
          name: /add to cart/i,
        })
        expect(addButtons.length).toBe(2) // 2 in-stock in mock
      })
    })

    it('renders "Unavailable" for out-of-stock products', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /unavailable/i }),
        ).toBeInTheDocument()
      })
    })

    it('disables button for out-of-stock products', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /unavailable/i }),
        ).toBeDisabled()
      })
    })

    it('enables button for in-stock products', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        const addButtons = screen.getAllByRole('button', {
          name: /add to cart/i,
        })
        addButtons.forEach((btn) => expect(btn).toBeEnabled())
      })
    })

    it('Add to Cart button is clickable', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getAllByRole('button', { name: /add to cart/i })[0]).toBeInTheDocument()
      })
      await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0])
      // button should still be there (no side-effect currently)
      expect(screen.getAllByRole('button', { name: /add to cart/i })[0]).toBeInTheDocument()
    })
  })

  // ---- Image Handling -----------------------------------------------------
  describe('Image Handling', () => {
    it('renders product images with alt text', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByAltText('Wireless Headphones')).toBeInTheDocument()
      })
    })

    it('shows placeholder on image load error', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByAltText('Wireless Headphones')).toBeInTheDocument()
      })

      const img = screen.getByAltText('Wireless Headphones')
      fireEvent.error(img)

      await waitFor(() => {
        expect(screen.getByText('Image Not Available')).toBeInTheDocument()
      })
    })
  })

  // ---- Error State --------------------------------------------------------
  describe('Error State', () => {
    it('shows error message when API returns failure', async () => {
      server.use(
        http.get('/api/products', () => {
          return HttpResponse.json({ success: false })
        }),
      )
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/error: failed to fetch products/i)).toBeInTheDocument()
      })
    })

    it('shows error message when network request fails', async () => {
      server.use(
        http.get('/api/products', () => {
          return HttpResponse.error()
        }),
      )
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/error:/i)).toBeInTheDocument()
      })
    })

    it('error message has correct class', async () => {
      server.use(
        http.get('/api/products', () => {
          return HttpResponse.json({ success: false })
        }),
      )
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/error:/i)).toHaveClass('error')
      })
    })
  })

  // ---- Empty State --------------------------------------------------------
  describe('Empty State', () => {
    it('shows "No products available" when data array is empty', async () => {
      server.use(
        http.get('/api/products', () => {
          return HttpResponse.json({ success: true, data: [] })
        }),
      )
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/no products available/i)).toBeInTheDocument()
      })
    })

    it('shows product count as 0', async () => {
      server.use(
        http.get('/api/products', () => {
          return HttpResponse.json({ success: true, data: [] })
        }),
      )
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText(/0 products available/i)).toBeInTheDocument()
      })
    })
  })

  // ---- Grid Layout --------------------------------------------------------
  describe('Grid Layout', () => {
    it('renders products inside a grid container', async () => {
      const { container } = render(<Dashboard />)
      await waitFor(() => {
        const grid = container.querySelector('.products-grid')
        expect(grid).toBeInTheDocument()
        expect(grid.children.length).toBe(3) // 3 mock products
      })
    })
  })
})

// ---------------------------------------------------------------------------
// Integration Tests — Full Page (App + Dashboard together)
// ---------------------------------------------------------------------------
describe('Integration: App + Dashboard', () => {
  // Use the App component so we test navbar + dashboard + footer together
  let AppModule

  beforeAll(async () => {
    AppModule = await import('./App')
  })

  it('renders navbar, products, and footer status together', async () => {
    render(<AppModule.default />)
    // Navbar
    expect(screen.getByText('Products')).toBeInTheDocument()
    // Products
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    })
    // Footer status
    await waitFor(() => {
      expect(screen.getByText(/online/i)).toBeInTheDocument()
    })
  })

  it('dashboard products load independently of health check', async () => {
    server.use(
      http.get('/api/health', () => HttpResponse.error()),
    )
    render(<AppModule.default />)
    // Products should still load even if health fails
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    })
  })

  it('health check loads independently of products', async () => {
    server.use(
      http.get('/api/products', () => HttpResponse.error()),
    )
    render(<AppModule.default />)
    // Health should still load even if products fail
    await waitFor(() => {
      expect(screen.getByText(/online/i)).toBeInTheDocument()
    })
  })

  it('handles both APIs failing gracefully', async () => {
    server.use(
      http.get('/api/health', () => HttpResponse.error()),
      http.get('/api/products', () => HttpResponse.error()),
    )
    render(<AppModule.default />)
    // Navbar should still render
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Cart')).toBeInTheDocument()
    // Error state for products
    await waitFor(() => {
      expect(screen.getByText(/error:/i)).toBeInTheDocument()
    })
  })
})
