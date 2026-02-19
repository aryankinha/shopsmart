import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from './App'
import { server } from './mocks/server'
import { http, HttpResponse } from 'msw'

// ---------------------------------------------------------------------------
// Unit Tests — App Component
// ---------------------------------------------------------------------------
describe('App Component', () => {
  // ---- Rendering ----------------------------------------------------------
  describe('Rendering', () => {
    it('renders navbar with ShopSmart branding', () => {
      render(<App />)
      expect(screen.getAllByText(/ShopSmart/i).length).toBeGreaterThan(0)
    })

    it('renders navigation links', () => {
      render(<App />)
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('Cart')).toBeInTheDocument()
    })

    it('renders Sign In button', () => {
      render(<App />)
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('renders footer with copyright', () => {
      render(<App />)
      expect(screen.getByText(/© 2026 ShopSmart/i)).toBeInTheDocument()
    })

    it('renders Dashboard inside main content', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByText(/product dashboard/i)).toBeInTheDocument()
      })
    })
  })

  // ---- Semantic HTML & Layout ---------------------------------------------
  describe('Layout Structure', () => {
    it('contains nav, main, and footer semantic elements', () => {
      const { container } = render(<App />)
      expect(container.querySelector('nav')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('footer')).toBeInTheDocument()
    })

    it('renders children in correct order: navbar → main → footer', () => {
      const { container } = render(<App />)
      const children = Array.from(container.querySelector('.app').children)
      expect(children[0]).toHaveClass('navbar')
      expect(children[1]).toHaveClass('main-content')
      expect(children[2]).toHaveClass('footer')
    })
  })

  // ---- Navigation ---------------------------------------------------------
  describe('Navigation', () => {
    it('Products link has active class', () => {
      render(<App />)
      expect(screen.getByText('Products')).toHaveClass('active')
    })

    it('all nav links point to "#"', () => {
      render(<App />)
      ;['Products', 'Categories', 'Cart'].forEach((label) => {
        expect(screen.getByText(label)).toHaveAttribute('href', '#')
      })
    })

    it('nav links are clickable', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByText('Categories'))
      expect(screen.getByText('Categories')).toBeInTheDocument()
    })

    it('Sign In button is clickable', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /sign in/i }))
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })
  })

  // ---- Backend Status (Footer) -------------------------------------------
  describe('Backend Status in Footer', () => {
    it('shows "Connecting..." before health response arrives', () => {
      // Delay the response so we can observe the loading state
      server.use(
        http.get('/api/health', async () => {
          await new Promise((r) => setTimeout(r, 5000))
          return HttpResponse.json({ status: 'ok', message: 'ok' })
        }),
      )
      render(<App />)
      expect(screen.getByText(/connecting/i)).toBeInTheDocument()
    })

    it('shows "Online" after successful health check', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByText(/online/i)).toBeInTheDocument()
      })
    })

    it('shows backend message after health check', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByText(/ShopSmart Backend is running/i)).toBeInTheDocument()
      })
    })

    it('applies status-ok class on healthy response', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByText(/online/i)).toHaveClass('status-ok')
      })
    })

    it('keeps app functional when health check fails', async () => {
      server.use(
        http.get('/api/health', () => {
          return HttpResponse.error()
        }),
      )
      render(<App />)
      // UI should still be rendered
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText(/Backend Status/i)).toBeInTheDocument()
    })

    it('shows "Backend Status:" label', () => {
      render(<App />)
      expect(screen.getByText(/backend status:/i)).toBeInTheDocument()
    })
  })
})
