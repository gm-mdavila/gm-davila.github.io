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

	// CSP se envía desde middleware con token fresco por petición (report-uri válido).
	// Solo cabeceras de seguridad que no dependen del token.
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
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

module.exports = nextConfig;
