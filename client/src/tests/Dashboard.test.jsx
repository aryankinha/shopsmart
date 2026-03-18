import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductsPage from '../pages/ProductsPage';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

const renderProductsPage = (addToCart = vi.fn()) => {
  return render(
    <MemoryRouter>
      <ProductsPage addToCart={addToCart} />
    </MemoryRouter>,
  );
};

describe('ProductsPage', () => {
  it('renders search input and products from API', async () => {
    renderProductsPage();

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      expect(screen.getByText('USB-C Cable')).toBeInTheDocument();
      expect(screen.getByText('Screen Protector')).toBeInTheDocument();
    });
  });

  it('filters products by search text', async () => {
    const user = userEvent.setup();
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Search products...'), 'cable');

    expect(screen.getByText('USB-C Cable')).toBeInTheDocument();
    expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
  });

  it('filters by category buttons', async () => {
    const user = userEvent.setup();
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Audio' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Audio' }));

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.queryByText('USB-C Cable')).not.toBeInTheDocument();
  });

  it('calls addToCart for in-stock product', async () => {
    const addToCart = vi.fn();
    const user = userEvent.setup();
    renderProductsPage(addToCart);

    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart.mock.calls[0][0]).toMatchObject({ name: 'Wireless Headphones' });
  });

  it('shows disabled Out of Stock button for unavailable product', async () => {
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
    });
  });

  it('shows empty state when products list is empty', async () => {
    server.use(
      http.get('http://localhost:4000/api/products', () =>
        HttpResponse.json({ success: true, data: [], count: 0 }),
      ),
    );

    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument();
    });
  });
});
