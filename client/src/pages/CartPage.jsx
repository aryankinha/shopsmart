import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import '../styles/HomePage.css';

function CartPage({ cart, onRemove, onUpdateQty, totalPrice }) {
  if (!cart.length) {
    return (
      <section className="page-container cart-page">
        <h1>Your Cart</h1>
        <p style={{ marginTop: '16px' }}>Your cart is empty.</p>
        <div style={{ marginTop: '16px' }}>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container cart-page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map((item) => (
            <article key={item._id} className="cart-row">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/64?text=Item'}
                alt={item.name}
                className="cart-row-image"
              />
              <div className="cart-row-meta">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-qty-controls">
                <button type="button" onClick={() => onUpdateQty(item._id, item.qty - 1)}>
                  -
                </button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => onUpdateQty(item._id, item.qty + 1)}>
                  +
                </button>
              </div>
              <p className="cart-line-total">${(item.price * item.qty).toFixed(2)}</p>
              <button
                type="button"
                className="cart-remove"
                onClick={() => onRemove(item._id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>

        <aside className="order-summary">
          <h2>Order Summary</h2>
          <p>Subtotal: ${totalPrice.toFixed(2)}</p>
          <hr />
          <p className="order-total">Total: ${totalPrice.toFixed(2)}</p>
          <div className="order-actions">
            <Link to="/products">
              <Button variant="outline" fullWidth>
                Continue Shopping
              </Button>
            </Link>
            <Button
              variant="primary"
              fullWidth
              onClick={() => alert('Checkout coming soon!')}
            >
              Checkout
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;