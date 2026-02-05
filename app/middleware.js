// app/middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
    console.log('Middleware running for:', request.nextUrl.pathname);  // ← Add this

    const response = NextResponse.next();
    const token = Date.now();

    const csp = `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; frame-src 'self'; child-src 'self'; worker-src 'none'; report-uri /api/csp-report?t=${token}`;

    response.headers.set('Content-Security-Policy', csp);

    return response;
}

export const config = {
    matcher: '/:path*',
};