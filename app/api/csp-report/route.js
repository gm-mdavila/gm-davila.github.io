// app/api/csp-report/route.js
// El navegador envía POST con Content-Type: application/csp-report. Respuesta 204 para no fallar.
export async function POST(request) {
	try {
		const report = await request.json();
		const token = new URL(request.url).searchParams.get("t");

		console.log("[CSP Report]", {
			timestamp: new Date().toISOString(),
			token: token ? `${token.slice(0, 20)}...` : null,
			"blocked-uri": report["csp-report"]?.["blocked-uri"] ?? report["blocked-uri"],
			"violated-directive": report["csp-report"]?.["violated-directive"] ?? report["violated-directive"],
		});
	} catch (_) {
		// Ignorar body inválido
	}
	return new Response(null, { status: 204 });
}
