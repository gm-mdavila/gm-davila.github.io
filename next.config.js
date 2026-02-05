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

	// CSP: política que aplica (app funciona) + Report-Only estricta para generar incidentes en el monitor.
	async headers() {
		const token = generateToken();
		const reportUri = `report-uri https://monitor.firstoken-staging.co/v1/pages/10CBFDEB26?t=${token}`;

		// Política que SÍ aplica: permite Next.js (unsafe-inline) para que la app cargue.
		const cspEnforcing = "default-src 'self'; " + "script-src 'self' 'unsafe-inline' https://captures.firstoken.co https://api.firstoken.co; " + "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self' https://api.firstoken.co; " + "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; base-uri 'self'; form-action 'self'; " + "frame-ancestors 'self'; frame-src https://captures.firstoken.co; " + "child-src 'self'; worker-src 'none'; " + reportUri;

		// Política Report-Only ESTRICTA: no bloquea, solo reporta violaciones → genera incidentes en Firstoken.
		const cspReportOnly = "default-src 'self'; " + "script-src 'self' https://captures.firstoken.co https://api.firstoken.co; " + "style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self' https://api.firstoken.co; " + "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; base-uri 'self'; form-action 'self'; " + "frame-ancestors 'self'; frame-src https://captures.firstoken.co; " + "child-src 'self'; worker-src 'none'; " + reportUri;

		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Content-Security-Policy", value: cspEnforcing },
					{ key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
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
