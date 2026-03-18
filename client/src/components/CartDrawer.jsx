import Button from './ui/Button';
import '../styles/CartDrawer.css';

function CartDrawer({ cart, onClose, onRemove, onUpdateQty, totalPrice }) {
  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>
          <button type="button" className="cart-drawer-close" onClick={onClose}>
            x
          </button>
        </div>

        <div className="cart-drawer-items">
          {!cart.length ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="cart-drawer-item">
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    ${item.price.toFixed(2)} x {item.qty}
                  </p>
                </div>
                <div className="cart-drawer-actions">
                  <button type="button" onClick={() => onUpdateQty(item._id, item.qty - 1)}>
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => onUpdateQty(item._id, item.qty + 1)}>
                    +
                  </button>
                  <button type="button" onClick={() => onRemove(item._id)}>
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          <p>
            Subtotal: <strong>${totalPrice.toFixed(2)}</strong>
          </p>
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
  );
}

export default CartDrawer;