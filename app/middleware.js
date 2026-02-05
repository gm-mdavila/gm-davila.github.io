// app/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
	// No establecer CSP aquí: next.config.js ya lo hace.
	// Una CSP con script-src 'self' y style-src 'self' bloqueaba los scripts
	// y estilos inline que Next.js usa para hidratación y la página no cargaba.
	const response = NextResponse.next();
	return response;
}

export const config = {
	matcher: "/:path*",
};
