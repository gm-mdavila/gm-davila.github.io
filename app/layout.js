import { Inter } from 'next/font/google'
import '../styles/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'SimpleShop | Secure E-Commerce',
    description: 'Secure e-commerce platform built with Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body className={inter.className}>
        {children}
        </body>
        </html>
    )
}