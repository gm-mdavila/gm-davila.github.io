// app/middleware.js
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const MONITOR_URL = process.env.MONITOR_PAGE_URL || "https://monitor.firstoken-staging.co/v1/pages/29FB809332";
const MONITOR_SECRET = process.env.MONITOR_PAGE_SECRET || "vAFmOFMDdZQsByJaDyfYGirULoBGgxgb";

async function getReportToken() {
	const secret = new TextEncoder().encode(MONITOR_SECRET);
	return new SignJWT({ jwtPayload: {} }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("15m").sign(secret);
}

export async function middleware(request) {
	const response = NextResponse.next();
	const token = await getReportToken();
	const reportUri = `${MONITOR_URL.replace(/\?.*$/, "")}?t=${token}`;

	// CSP que SÍ aplica: permite inline y eval para que Next.js funcione.
	// Con esto: script externo SÍ se bloquea; inline y eval NO (por eso no llegan esos reportes).
	const cspEnforcing = "default-src 'self'; " + "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self' ws: wss:; " + "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; base-uri 'self'; form-action 'self'; " + "frame-ancestors 'self'; frame-src 'none'; child-src 'self'; worker-src 'none'; " + `report-uri ${reportUri}`;

	// Report-Only estricta: sin unsafe-inline ni unsafe-eval → los reportes de inline y eval SÍ llegan al monitor.
	const cspReportOnly = "default-src 'self'; " + "script-src 'self'; " + "style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self'; " + "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; base-uri 'self'; form-action 'self'; " + "frame-ancestors 'self'; frame-src 'none'; child-src 'self'; worker-src 'none'; " + `report-uri ${reportUri}`;

	response.headers.set("Content-Security-Policy", cspEnforcing);
	response.headers.set("Content-Security-Policy-Report-Only", cspReportOnly);
	return response;
}

export const config = {
	matcher: "/:path*",
};
