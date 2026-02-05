'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import PaymentModal from './components/PaymentModal';
import SecuritySection from './components/SecuritySection';

export default function Home() {
    useEffect(() => {
        console.log('API Endpoints available:');
        console.log('- /api/products');
        console.log('- /api/cart');
        console.log('- /api/payment');
        console.log('- /api/csp-report');
    }, []);

    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                // Fallback data
                setProducts([
                    {
                        id: 1,
                        title: "Wireless Headphones",
                        description: "Noise-cancelling wireless headphones with premium sound quality and 30-hour battery life.",
                        price: 199.99,
                        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
                    },
                    {
                        id: 2,
                        title: "Smart Watch Pro",
                        description: "Advanced smartwatch with health monitoring, GPS, and water resistance up to 50 meters.",
                        price: 349.99,
                        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=300&fit=crop"
                    },
                    {
                        id: 3,
                        title: "Laptop Ultrabook",
                        description: "Lightweight laptop with 16GB RAM, 512GB SSD, and 14-inch retina display.",
                        price: 1299.99,
                        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop"
                    },
                    {
                        id: 4,
                        title: "Camera DSLR",
                        description: "Professional DSLR camera with 24MP sensor and 4K video recording capabilities.",
                        price: 899.99,
                        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop"
                    },
                    {
                        id: 5,
                        title: "Wireless Earbuds",
                        description: "True wireless earbuds with charging case and touch controls.",
                        price: 129.99,
                        image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?w=400&h=300&fit=crop"
                    },
                    {
                        id: 6,
                        title: "Gaming Console",
                        description: "Next-gen gaming console with 1TB storage and 4K gaming support.",
                        price: 499.99,
                        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }

        setCartCount(cartCount + 1);
    };

    const removeFromCart = (id) => {
        const item = cartItems.find(item => item.id === id);
        if (item) {
            setCartCount(cartCount - item.quantity);
            setCartItems(cartItems.filter(item => item.id !== id));
        }
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(id);
            return;
        }

        const item = cartItems.find(item => item.id === id);
        const oldQuantity = item ? item.quantity : 0;

        setCartItems(cartItems.map(item =>
            item.id === id
                ? { ...item, quantity: newQuantity }
                : item
        ));

        setCartCount(cartCount + (newQuantity - oldQuantity));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div className="container">
            <Header cartCount={cartCount} openCart={() => setIsCartOpen(true)} />

            <main>
                <section className="hero">
                    <h1>Welcome to SimpleShop</h1>
                    <p>Secure e-commerce with next-gen protection</p>
                </section>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <ProductGrid products={products} addToCart={addToCart} />
                )}

                <SecuritySection />
            </main>

            <CartSidebar
                isOpen={isCartOpen}
                closeCart={() => setIsCartOpen(false)}
                items={cartItems}
                removeItem={removeFromCart}
                updateQuantity={updateQuantity}
                checkout={() => {
                    setIsCartOpen(false);
                    setIsPaymentOpen(true);
                }}
                total={calculateTotal()}
            />

            <PaymentModal
                isOpen={isPaymentOpen}
                closeModal={() => setIsPaymentOpen(false)}
                amount={calculateTotal()}
            />

            <footer>
                <p>© 2026 SimpleShop. All rights reserved.</p>
            </footer>
        </div>
    );
}