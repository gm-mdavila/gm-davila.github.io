export default function Header({ cartCount, openCart }) {
    return (
        <header>
            <div className="logo">
                <i className="fas fa-shopping-bag" style={{ marginRight: '10px' }}></i>
                Simple<span>Shop</span>
            </div>
            <div className="cart-icon" onClick={openCart}>
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                )}
            </div>
        </header>
    );
}