export default function ProductCard({ product, addToCart }) {
	return (
		<div className="product-card">
			<div className="product-image">
				<img src={product.image} alt={product.title} loading="lazy" />
			</div>
			<div className="product-info">
				<h3 className="product-title">{product.title}</h3>
				<p className="product-description">{product.description}</p>
				<div className="product-price">${product.price.toFixed(2)}</div>
				<button className="add-to-cart" onClick={() => addToCart(product)}>
					<i className="fas fa-cart-plus icon-spacing"></i>
					Add to Cart
				</button>
			</div>
		</div>
	);
}
