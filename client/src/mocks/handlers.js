import { http, HttpResponse } from 'msw'

const products = [
  {
    _id: 'p1',
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    imageUrl: 'https://picsum.photos/seed/test-headphones/400/300',
    category: 'Audio',
    stock: 12,
  },
  {
    _id: 'p2',
    name: 'USB-C Cable',
    price: 12.99,
    description: 'Fast charging USB-C cable for all devices',
    imageUrl: 'https://picsum.photos/seed/test-cable/400/300',
    category: 'Accessories',
    stock: 20,
  },
  {
    _id: 'p3',
    name: 'Screen Protector',
    price: 9.99,
    description: 'Tempered glass screen protector for phones',
    imageUrl: 'https://picsum.photos/seed/test-screen/400/300',
    category: 'Accessories',
    stock: 0,
  },
]

export const handlers = [
  // Health check
  http.get('http://localhost:4000/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      message: 'ShopSmart Backend is running',
      timestamp: new Date().toISOString(),
    })
  }),

  // All products
  http.get('http://localhost:4000/api/products', () => {
    return HttpResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  }),

  // Single product by id
  http.get('http://localhost:4000/api/products/:id', ({ params }) => {
    const product = products.find((p) => p._id === params.id)
    if (product) {
      return HttpResponse.json({ success: true, data: product })
    }
    return HttpResponse.json(
      { success: false, message: 'Product not found' },
      { status: 404 },
    )
  }),
]
