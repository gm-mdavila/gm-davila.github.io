// middleware.js – CSP con la misma estructura que el helmet (SECRET_KEY + MONITOR_REPORT_URL)
// En middleware corre Edge: jsonwebtoken no está disponible (usa Node crypto), por eso se usa jose.
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const secretKey = "vAFmOFMDdZQsByJaDyfYGirULoBGgxgb";
const monitorReportUrl = "https://monitor.firstoken-staging.co/v1/monitor/29FB809332";

async function generateToken() {
	if (!secretKey) return "";
	const secret = new TextEncoder().encode(secretKey);
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

	const scriptSrc = ["'self'", `'nonce-${nonce}'`];
	const styleSrc = ["'self'", `'nonce-${nonce}'`, "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"];
	const imgSrc = ["'self'", "data:", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://fonts.googleapis.com", "https://img.firstoken.co", "https://flagcdn.com", "https://images.unsplash.com"];
	const connectSrc = ["'self'", "ws:", "wss:", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://fonts.googleapis.com", "https://img.firstoken.co"];
	const fontSrc = ["'self'", "data:", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"];

	const sep = monitorReportUrl && monitorReportUrl.includes("?") ? "&" : "?";
	const reportPart = monitorReportUrl && secretKey ? ` report-uri ${monitorReportUrl}${sep}t=${await generateToken()}` : "";

	const csp = "default-src 'self'; " + `script-src ${scriptSrc.join(" ")}; ` + `style-src ${styleSrc.join(" ")}; ` + `img-src ${imgSrc.join(" ")}; ` + `connect-src ${connectSrc.join(" ")}; ` + `font-src ${fontSrc.join(" ")}; ` + "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; frame-src 'none'; child-src 'self'; worker-src 'none';" + reportPart;

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
