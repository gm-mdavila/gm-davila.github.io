'use client';

import { useState } from 'react';

export default function SecuritySection() {
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { timestamp, message }]);
    };

    const handleTest = async (testType) => {
        addLog(`Starting ${testType} test...`);

        try {
            const response = await fetch(`/api/security?test=${testType}`);
            const data = await response.json();

            addLog(`${testType} test completed: ${data.message}`);
        } catch (error) {
            addLog(`${testType} test failed: ${error.message}`);
        }
    };

    // return (
    //     <section className="security-section">
    //         <h2>
    //             <i className="fas fa-shield-alt"></i>
    //             Security Monitoring & Testing
    //         </h2>
    //         <p>Test the security features of our e-commerce platform</p>
    //
    //         <div className="monitor-buttons">
    //             <button
    //                 className="monitor-btn"
    //                 onClick={() => handleTest('xss')}
    //             >
    //                 <i className="fas fa-code"></i> Test XSS Protection
    //             </button>
    //             <button
    //                 className="monitor-btn"
    //                 onClick={() => handleTest('csrf')}
    //             >
    //                 <i className="fas fa-exchange-alt"></i> Test CSRF Protection
    //             </button>
    //             <button
    //                 className="monitor-btn"
    //                 onClick={() => handleTest('sql')}
    //             >
    //                 <i className="fas fa-database"></i> Test SQL Injection
    //             </button>
    //             <button
    //                 className="monitor-btn"
    //                 onClick={() => handleTest('encryption')}
    //             >
    //                 <i className="fas fa-lock"></i> Test Encryption
    //             </button>
    //             <button
    //                 className="monitor-btn"
    //                 onClick={() => {
    //                     addLog('Manual security check initiated');
    //                     handleTest('manual');
    //                 }}
    //             >
    //                 <i className="fas fa-user-shield"></i> Manual Security Check
    //             </button>
    //         </div>
    //
    //         <div className="test-log">
    //             <div style={{ marginBottom: '10px', fontWeight: '600' }}>
    //                 Security Test Log:
    //             </div>
    //             {logs.length === 0 ? (
    //                 <div style={{ color: '#636e72', fontStyle: 'italic' }}>
    //                     No tests run yet. Click buttons above to run security tests.
    //                 </div>
    //             ) : (
    //                 logs.map((log, index) => (
    //                     <div key={index} className="log-entry">
    //                         <span className="log-time">[{log.timestamp}]</span>
    //                         {log.message}
    //                     </div>
    //                 )).reverse()
    //             )}
    //         </div>
    //     </section>
    // );
}