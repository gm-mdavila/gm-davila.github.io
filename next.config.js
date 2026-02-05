const jwt = require("jsonwebtoken");
/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
		],
	},

	// CSP mínima: solo lo necesario para el demo. report-uri envía los incidentes al monitor.
	async headers() {
		const token = generateToken();
		const reportUri = `report-uri https://monitor.firstoken-staging.co/v1/pages/10CBFDEB26?t=${token}`;

		const csp = "default-src 'self'; " + "script-src 'self' 'unsafe-inline'; " + "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self'; " + "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; base-uri 'self'; form-action 'self'; " + "frame-ancestors 'self'; frame-src 'none'; " + "child-src 'self'; worker-src 'none'; " + reportUri;

		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Content-Security-Policy", value: csp },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "X-XSS-Protection", value: "1; mode=block" },
				],
			},
		];
	},

	eslint: {
		ignoreDuringBuilds: true,
	},
};
// Function to generate JWT token
function generateToken() {
	return jwt.sign({ jwtPayload: {} }, SECRET_KEY, { expiresIn: "15m" });
}
const SECRET_KEY = "vAFmOFMDdZQsByJaDyfYGirULoBGgxgb"; // From Step 1
const MONITOR_URL = "https://monitor.firstoken-staging.co/v1/pages/10CBFDEB26"; // From Step 2

module.exports = nextConfig;
