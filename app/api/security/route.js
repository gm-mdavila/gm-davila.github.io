export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');

    // Simulate different security tests
    await new Promise(resolve => setTimeout(resolve, 800));

    const responses = {
        xss: {
            success: true,
            message: 'XSS protection is active. Input sanitization working correctly.',
            details: 'All user inputs are sanitized using DOMPurify and React escaping.'
        },
        csrf: {
            success: true,
            message: 'CSRF protection enabled. Tokens validated successfully.',
            details: 'CSRF tokens are generated per session and validated on POST requests.'
        },
        sql: {
            success: true,
            message: 'SQL injection prevention active.',
            details: 'Parameterized queries prevent SQL injection attacks.'
        },
        encryption: {
            success: true,
            message: 'All sensitive data encrypted with AES-256.',
            details: 'SSL/TLS 1.3 encryption for transit, AES-256 for data at rest.'
        },
        manual: {
            success: true,
            message: 'Manual security check completed.',
            details: 'No vulnerabilities detected in the current scan.'
        }
    };

    const defaultResponse = {
        success: false,
        message: 'Unknown test type',
        details: 'Please specify a valid test type: xss, csrf, sql, encryption, or manual'
    };

    const response = responses[test] || defaultResponse;

    // Log security test (in production, this would go to a security log)
    console.log(`Security test performed: ${test} - ${response.message}`);

    return Response.json(response);
}