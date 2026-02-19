import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import './App.css'

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        fetch(`${apiUrl}/api/health`)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error('Error fetching health check:', err));
    }, []);

    return (
        <div className="app">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="white"/>
                        </svg>
                        <h1>ShopSmart</h1>
                    </div>
                    <div className="navbar-links">
                        <a href="#" className="nav-link active">Products</a>
                        <a href="#" className="nav-link">Categories</a>
                        <a href="#" className="nav-link">Cart</a>
                        <button className="nav-btn">Sign In</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <Dashboard />
            </main>

            {/* Footer with Backend Status */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="backend-status">
                        <span className="status-label">Backend Status:</span>
                        {data ? (
                            <>
                                <span className={`status-indicator ${data.status === 'ok' ? 'status-ok' : 'status-error'}`}>
                                    {data.status === 'ok' ? '● Online' : '● Offline'}
                                </span>
                                <span className="status-message">| {data.message}</span>
                            </>
                        ) : (
                            <span className="status-indicator status-loading">⟳ Connecting...</span>
                        )}
                    </div>
                    <div className="footer-info">
                        <p>&copy; 2026 ShopSmart. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
