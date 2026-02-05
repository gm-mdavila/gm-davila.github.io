export default function CartSidebar({ isOpen, closeCart, items, removeItem, updateQuantity, checkout, total }) {
	return (
		<div className={`cart-sidebar ${isOpen ? "active" : ""}`}>
			<div className="cart-header">
				<h2>Shopping Cart</h2>
				<button className="close-cart" onClick={closeCart}>
					<i className="fas fa-times"></i>
				</button>
			</div>

			<div className="cart-items">
				{items.length === 0 ? (
					<p className="cart-empty-msg">Your cart is empty</p>
				) : (
					items.map((item) => (
						<div key={item.id} className="cart-item">
							<div className="cart-item-img">
								<img src={item.image} alt={item.title} />
							</div>
							<div className="cart-item-details">
								<div className="cart-item-title">{item.title}</div>
								<div className="cart-item-price">${item.price.toFixed(2)}</div>
								<div className="cart-item-quantity">
									<button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
										<i className="fas fa-minus"></i>
									</button>
									<span className="quantity">{item.quantity}</span>
									<button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
										<i className="fas fa-plus"></i>
									</button>
								</div>
								<button className="remove-item" onClick={() => removeItem(item.id)}>
									<i className="fas fa-trash icon-spacing-sm"></i>
									Remove
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{items.length > 0 && (
				<>
					<div className="cart-total">
						<span>Total:</span>
						<span>${total}</span>
					</div>
					<button className="checkout-btn" onClick={checkout}>
						<i className="fas fa-lock icon-spacing"></i>
						Proceed to Checkout
					</button>
				</>
			)}
		</div>
	);
}
