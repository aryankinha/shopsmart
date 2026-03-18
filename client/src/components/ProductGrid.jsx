import ProductCard from './ProductCard';
import Spinner from './ui/Spinner';

function ProductGrid({ products, loading, onAddToCart }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <Spinner />
      </div>
    );
  }

  if (!products.length) {
    return <p style={{ textAlign: 'center', padding: '24px 0' }}>No products found.</p>;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default ProductGrid;