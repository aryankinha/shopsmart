import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import Button from '../components/ui/Button';
import { getProducts } from '../services/api';
import '../styles/HomePage.css';

const normalizeProduct = (item) => ({
  _id: item._id ?? String(item.id),
  name: item.name,
  price: Number(item.price) || 0,
  imageUrl: item.imageUrl ?? item.image ?? '',
  category: item.category ?? 'General',
  stock: typeof item.stock === 'number' ? item.stock : item.inStock ? 1 : 0,
});

function HomePage({ addToCart }) {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const payload = await getProducts();
        const list = Array.isArray(payload) ? payload : payload.data || [];
        setFeatured(list.slice(0, 4).map(normalizeProduct));
      } catch (error) {
        console.error('Failed to fetch featured products', error);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section>
      <div className="hero">
        <h1>Discover Products You&apos;ll Love</h1>
        <p>Shop the best products, curated just for you.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Shop Now
        </Button>
      </div>

      <div className="featured-header">
        <h2>Featured Products</h2>
      </div>
      <div className="featured-body">
        <ProductGrid
          products={featured}
          loading={loading}
          onAddToCart={addToCart}
        />
      </div>
    </section>
  );
}

export default HomePage;