import { http, HttpResponse } from 'msw'

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://via.placeholder.com/200?text=Headphones',
    inStock: true,
  },
  {
    id: 2,
    name: 'USB-C Cable',
    price: 12.99,
    description: 'Fast charging USB-C cable for all devices',
    image: 'https://via.placeholder.com/200?text=Cable',
    inStock: true,
  },
  {
    id: 3,
    name: 'Screen Protector',
    price: 9.99,
    description: 'Tempered glass screen protector for phones',
    image: 'https://via.placeholder.com/200?text=Screen+Protector',
    inStock: false,
  },
]

export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      message: 'ShopSmart Backend is running',
      timestamp: new Date().toISOString(),
    })
  }),

  // All products
  http.get('/api/products', () => {
    return HttpResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  }),

  // Single product by id
  http.get('/api/products/:id', ({ params }) => {
    const product = products.find((p) => p.id === Number(params.id))
    if (product) {
      return HttpResponse.json({ success: true, data: product })
    }
    return HttpResponse.json(
      { success: false, message: 'Product not found' },
      { status: 404 },
    )
  }),
]
