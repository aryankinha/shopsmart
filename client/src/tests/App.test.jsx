import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.localStorage?.removeItem) {
      window.localStorage.removeItem('shopsmart_cart');
    }
    window.history.pushState({}, '', '/');
  });

  it('renders navbar, home hero, and footer', () => {
    render(<App />);

    expect(screen.getByText('ShopSmart')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Discover Products You'll Love/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Built with React & Node\.js/i),
    ).toBeInTheDocument();
  });

  it('navigates to products page from navbar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Products' }));

    expect(
      screen.getByPlaceholderText('Search products...'),
    ).toBeInTheDocument();
  });

  it('opens cart drawer from cart icon click', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const cartLink = container.querySelector('.cart-link');
    expect(cartLink).toBeInTheDocument();

    await user.click(cartLink);

    expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('loads featured products on home page', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
  });
});
