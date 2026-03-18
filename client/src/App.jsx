import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import useCart from './hooks/useCart';
import './styles/index.css';

function App() {
    const {
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        totalItems,
        totalPrice,
    } = useCart();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <BrowserRouter>
            <Navbar
                cartCount={totalItems}
                onCartClick={() => setDrawerOpen(true)}
            />
            {drawerOpen && (
                <CartDrawer
                    cart={cart}
                    onClose={() => setDrawerOpen(false)}
                    onRemove={removeFromCart}
                    onUpdateQty={updateQty}
                    totalPrice={totalPrice}
                />
            )}
            <main>
                <Routes>
                    <Route path="/" element={<HomePage addToCart={addToCart} />} />
                    <Route
                        path="/products"
                        element={<ProductsPage addToCart={addToCart} />}
                    />
                    <Route
                        path="/cart"
                        element={
                            <CartPage
                                cart={cart}
                                onRemove={removeFromCart}
                                onUpdateQty={updateQty}
                                totalPrice={totalPrice}
                            />
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
