import { Link, NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ cartCount = 0, onCartClick }) {
  return (
    <header className="navbar">
      <Link className="navbar-logo" to="/">
        ShopSmart
      </Link>

      <nav className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <Link
          className="cart-link"
          to="/cart"
          onClick={(e) => {
            if (onCartClick) {
              e.preventDefault();
              onCartClick();
            }
          }}
        >
          <span className="cart-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </span>
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;