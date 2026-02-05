// app/api/csp-report/route.js
export async function POST(request) {
    try {
        const report = await request.json();
        const token = new URL(request.url).searchParams.get('t');

        console.log('CSP Violation:', {
            timestamp: new Date().toISOString(),
            token: token,
            blocked: report['blocked-uri'],
            violated: report['violated-directive']
        });

        return Response.json({ logged: true });

    } catch (error) {
        return Response.json({ logged: false }, { status: 400 });
    }
}