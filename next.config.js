/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },

    // ADD THIS SECTION for CSP headers
    async headers() {
        const token = Date.now();

        // Create CSP policy - must allow your external resources!
    //     const csp = `
    //   default-src 'self';
    //   script-src 'self' 'unsafe-inline' 'unsafe-eval';
    //   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
    //   img-src 'self' data: https://images.unsplash.com https:;
    //   font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com;
    //   connect-src 'self' ws://localhost:3003 ws://localhost:3000;
    //   frame-ancestors 'self';
    //   frame-src 'self';
    //   child-src 'self';
    //   worker-src 'none';
    //   report-uri /api/csp-report?t=${token}
    // `.replace(/\s+/g, ' ').trim();

        const csp =    `default-src 'self'; ` +
            `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://captures.firstoken.co https://api.firstoken.co; ` +
            `style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; ` +
            `img-src 'self' data: https://images.unsplash.com; ` +
            `connect-src 'self' https://api.firstoken.co; ` +
            `font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; ` +
            `object-src 'none'; ` +
            `base-uri 'self'; ` +
            `form-action 'self'; ` +
            `frame-ancestors 'self'; ` +
            `frame-src https://captures.firstoken.co; ` +
            `child-src 'self'; ` +
            `worker-src 'none'; ` +
            `report-uri /api/csp-report?t=${token}`;

        return [
            {
                // Apply to ALL routes
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: csp
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    }
                ]
            }
        ];
    },

    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig;