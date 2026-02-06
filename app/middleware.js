// app/middleware.js
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

// Monitor Firstoken – page 29FB809332. Opcional: MONITOR_PAGE_URL y MONITOR_PAGE_SECRET en .env.local
const MONITOR_URL = process.env.MONITOR_PAGE_URL || "https://monitor.firstoken-staging.co/v1/pages/29FB809332";
const MONITOR_SECRET = process.env.MONITOR_PAGE_SECRET || "vAFmOFMDdZQsByJaDyfYGirULoBGgxgb";

async function getReportToken() {
	const secret = new TextEncoder().encode(MONITOR_SECRET);
	return new SignJWT({ payload: { time: Date.now() } }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secret);
}

function getNonce() {
	const arr = new Uint8Array(24);
	crypto.getRandomValues(arr);
	return btoa(String.fromCharCode(...arr))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export async function middleware(request) {
	const nonce = getNonce();
	const token = await getReportToken();
	const reportUri = `${MONITOR_URL.replace(/\?.*$/, "")}?t=${token}`;

	const csp = "default-src 'self'; " + `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; ` + `style-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://fonts.googleapis.com; ` + "img-src 'self' data: https://images.unsplash.com; " + "connect-src 'self' ws: wss:; " + "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " + "object-src 'none'; base-uri 'self'; form-action 'self'; " + "frame-ancestors 'self'; frame-src 'none'; child-src 'self'; worker-src 'none'; " + `report-uri ${reportUri}`;

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-nonce", nonce);
	requestHeaders.set("Content-Security-Policy", csp);

	const response = NextResponse.next({
		request: { headers: requestHeaders },
	});
	response.headers.set("Content-Security-Policy", csp);
	return response;
}

export const config = {
	// No aplicar CSP/nonce a API, estáticos ni prefetch (como recomienda Next.js para nonces).
	matcher: [
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
