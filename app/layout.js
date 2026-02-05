import { Inter } from 'next/font/google'
import '../styles/global.css'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'SimpleShop | Secure E-Commerce with Firstoken',
    description: 'Secure shopping with Firstoken Monitor protection',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <Head>
            {/* CSP Header without unsafe-inline */}
            <meta httpEquiv="Content-Security-Policy"
                  content="default-src 'self';
                   script-src 'self' https://captures.firstoken.co;
                   style-src 'self' https://fonts.googleapis.com;
                   img-src 'self' data: https://cdn.firstoken.co https://images.unsplash.com;
                   font-src 'self' https://fonts.gstatic.com;
                   connect-src 'self' https://api.firstoken.com;
                   frame-src 'self' https://captures.firstoken.co;
                   frame-ancestors 'self';
                   form-action 'self';
                   report-uri https://monitor.firstoken.co/v1/pages/8BD7A644AC" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        </Head>
        <body className={inter.className}>
        {children}
        </body>
        </html>
    )
}