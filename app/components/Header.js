import Link from "next/link";

export default function Header({ cartCount, openCart }) {
	return (
		<header>
			<Link href="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
				<i className="fas fa-shopping-bag icon-spacing-lg"></i>
				Simple<span>Shop</span>
			</Link>
			<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
				<Link href="/csp-tests" className="csp-tests-nav-link" style={{ fontSize: "14px", color: "#0984e3", textDecoration: "none" }}>
					<i className="fas fa-shield-alt"></i> CSP Tests
				</Link>
				<div className="cart-icon" onClick={openCart}>
					<i className="fas fa-shopping-cart"></i>
					{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
				</div>
			</div>
		</header>
	);
}
