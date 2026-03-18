import { useEffect, useMemo, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/api';
import Button from '../components/ui/Button';
import '../styles/HomePage.css';

const normalizeProduct = (item) => ({
  _id: item._id ?? String(item.id),
  name: item.name,
  price: Number(item.price) || 0,
  imageUrl: item.imageUrl ?? item.image ?? '',
  category: item.category ?? 'General',
  stock: typeof item.stock === 'number' ? item.stock : item.inStock ? 1 : 0,
});

function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const payload = await getProducts();
        const list = Array.isArray(payload) ? payload : payload.data || [];
        setProducts(list.map(normalizeProduct));
      } catch (error) {
        console.error('Failed to fetch products', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const found = new Set(products.map((item) => item.category).filter(Boolean));
    return ['All', ...found];
  }, [products]);

  const filtered = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="page-container products-page">
      <div className="products-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="products-search"
        />
        <div className="category-filters">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'primary' : 'outline'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <ProductGrid
        products={filtered}
        loading={loading}
        onAddToCart={addToCart}
      />
    </section>
  );
}

export default ProductsPage;
