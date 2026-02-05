import ProductCard from './ProductCard';

export default function ProductGrid({ products, addToCart }) {
    return (
        <section className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                />
            ))}
        </section>
    );
}