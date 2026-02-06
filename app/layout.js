import { Inter } from "next/font/google";
import "../styles/global.css";

const inter = Inter({ subsets: ["latin"] });

// Necesario para nonces: la página se renderiza en cada request y Next.js puede inyectar el nonce en los scripts.
export const dynamic = "force-dynamic";

export const metadata = {
	title: "SimpleShop | Secure E-Commerce with Firstoken",
	description: "Secure shopping with Firstoken Monitor protection",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
