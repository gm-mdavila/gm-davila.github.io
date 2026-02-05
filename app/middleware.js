// app/middleware.js
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const MONITOR_URL = process.env.MONITOR_PAGE_URL || "https://monitor.firstoken-staging.co/v1/pages/10CBFDEB26";
const MONITOR_SECRET = process.env.MONITOR_PAGE_SECRET || "vAFmOFMDdZQsByJaDyfYGirULoBGgxgb";

async function getReportToken() {
	const secret = new TextEncoder().encode(MONITOR_SECRET);
	return new SignJWT({ jwtPayload: {} }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("15m").sign(secret);
}

export async function middleware(request) {
	const response = NextResponse.next();
	const token = await getReportToken();
	const reportUri = `${MONITOR_URL.replace(/\?.*$/, "")}?t=${token}`;
	const csp = "default-src 'self'; " + "script-src 'self' 'unsafe-inline'; " + "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self'; " + "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; base-uri 'self'; form-action 'self'; " + "frame-ancestors 'self'; frame-src 'none'; " + "child-src 'self'; worker-src 'none'; " + `report-uri ${reportUri}`;
	response.headers.set("Content-Security-Policy", csp);
	return response;
}

export const config = {
	matcher: "/:path*",
};
