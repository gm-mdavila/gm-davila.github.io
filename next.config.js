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

	// CSP headers – nivel de endurecimiento vía env:
	// CSP_STRICT=true  → política estricta (sin unsafe-inline/unsafe-eval; los tests CSP disparan reportes; la app puede fallar sin nonces).
	// Por defecto: política endurecida sin 'unsafe-eval'; con 'unsafe-inline' para que Next siga funcionando.
	async headers() {
		const token = generateToken();
		const strict = process.env.CSP_STRICT === "true";

		const reportUri = `report-uri https://monitor.firstoken-staging.co/v1/pages/10CBFDEB26?t=${token}`;

		// Política endurecida: sin unsafe-eval. script-src mantiene 'unsafe-inline' para hidratación de Next.js.
		const scriptSrcRelaxed = "script-src 'self' 'unsafe-inline' https://captures.firstoken.co https://api.firstoken.co; ";
		// Política estricta: sin unsafe-inline ni unsafe-eval (útil para probar reportes CSP; la app puede romperse sin nonces).
		const scriptSrcStrict = "script-src 'self' https://captures.firstoken.co https://api.firstoken.co; ";

		const scriptSrc = strict ? scriptSrcStrict : scriptSrcRelaxed;
		const styleSrc = strict ? "style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " : "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; ";

		const csp = "default-src 'self'; " + scriptSrc + styleSrc + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self' https://api.firstoken.co; " + "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; " + "base-uri 'self'; " + "form-action 'self'; " + "frame-ancestors 'self'; " + "frame-src https://captures.firstoken.co; " + "child-src 'self'; " + "worker-src 'none'; " + reportUri;

		// Para política estricta (y que los tests en /csp-tests disparen más reportes): CSP_STRICT=true npm run dev
		return [
			{
				// Apply to ALL routes
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: csp,
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
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
