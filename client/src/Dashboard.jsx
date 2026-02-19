import { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    fetch(`${apiUrl}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
        } else {
          setError('Failed to fetch products');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Error fetching products: ' + err.message);
        setLoading(false);
      });
  }, []);

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  if (loading) {
    return <div className="dashboard"><p className="loading">Loading products...</p></div>;
  }

  if (error) {
    return <div className="dashboard"><p className="error">Error: {error}</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Product Dashboard</h2>
        <div className="product-count">{products.length} Products Available</div>
      </div>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
              <div className="product-image">
                {imageErrors[product.id] ? (
                  <div className="image-placeholder">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#ccc"/>
                    </svg>
                    <span className="placeholder-text">Image Not Available</span>
                  </div>
                ) : (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={() => handleImageError(product.id)}
                  />
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <div className="product-footer">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>
                <button className="add-to-cart-btn" disabled={!product.inStock}>
                  {product.inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
