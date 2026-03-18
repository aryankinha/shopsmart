const request = require('supertest');
const Product = require('../src/models/Product');
const app = require('../src/app');

jest.mock('../src/models/Product');

describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
});

describe('GET /api/products', () => {
    it('returns products list', async () => {
        const mockProducts = [{ _id: '1', name: 'Wireless Headphones' }];
        const sort = jest.fn().mockResolvedValue(mockProducts);
        Product.find.mockReturnValue({ sort });

        const res = await request(app).get('/api/products');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].name).toBe('Wireless Headphones');
    });

    it('returns 500 when product fetch fails', async () => {
        const sort = jest.fn().mockRejectedValue(new Error('DB error'));
        Product.find.mockReturnValue({ sort });

        const res = await request(app).get('/api/products');

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Failed to fetch products');
    });
});

describe('GET /api/products/:id', () => {
    it('returns one product when found', async () => {
        Product.findById.mockResolvedValue({ _id: '123', name: 'USB-C Cable' });

        const res = await request(app).get('/api/products/123');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('USB-C Cable');
    });

    it('returns 404 when product is not found', async () => {
        Product.findById.mockResolvedValue(null);

        const res = await request(app).get('/api/products/123');

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Product not found');
    });

    it('returns 400 for invalid product id', async () => {
        Product.findById.mockRejectedValue(new Error('Cast error'));

        const res = await request(app).get('/api/products/not-a-valid-id');

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid product id');
    });
});
