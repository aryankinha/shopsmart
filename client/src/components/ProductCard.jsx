import { Link } from 'react-router-dom';
import Badge from './ui/Badge';
import Button from './ui/Button';
import '../styles/ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock === 0;

  return (
    <Link to={`/products/${product._id}`} className="product-card-link">
      <article className="product-card">
        <div className="product-card-image-wrap">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="product-card-image" />
          ) : (
            <div className="product-card-placeholder">No Image</div>
          )}
        </div>
        <div className="product-card-content">
          <Badge>{product.category || 'General'}</Badge>
          <h3>{product.name}</h3>
          <p className="product-card-price">${product.price.toFixed(2)}</p>
          <Button
            variant="primary"
            fullWidth
            disabled={isOutOfStock}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isOutOfStock) onAddToCart(product);
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;