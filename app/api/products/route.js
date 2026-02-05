export async function GET() {
    // In a real application, this would fetch from a database
    const products = [
        {
            id: 1,
            title: "Wireless Headphones",
            description: "Noise-cancelling wireless headphones with premium sound quality and 30-hour battery life.",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
            category: "Electronics",
            stock: 50
        },
        {
            id: 2,
            title: "Smart Watch Pro",
            description: "Advanced smartwatch with health monitoring, GPS, and water resistance up to 50 meters.",
            price: 349.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
            category: "Electronics",
            stock: 30
        },
        {
            id: 3,
            title: "Laptop Ultrabook",
            description: "Lightweight laptop with 16GB RAM, 512GB SSD, and 14-inch retina display.",
            price: 1299.99,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
            category: "Computers",
            stock: 15
        },
        {
            id: 4,
            title: "Camera DSLR",
            description: "Professional DSLR camera with 24MP sensor and 4K video recording capabilities.",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
            category: "Photography",
            stock: 20
        },
        {
            id: 5,
            title: "Wireless Earbuds",
            description: "True wireless earbuds with charging case and touch controls.",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?w=400&h=300&fit=crop",
            category: "Electronics",
            stock: 100
        },
        {
            id: 6,
            title: "Gaming Console",
            description: "Next-gen gaming console with 1TB storage and 4K gaming support.",
            price: 499.99,
            image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop",
            category: "Gaming",
            stock: 25
        }
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return Response.json(products);
}