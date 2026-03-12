import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { SocketProvider } from '../lib/socket.tsx'
import { AuthProvider } from '../lib/auth'
import { Toaster } from '../components/ui/sonner'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgriConnect - AI-Powered Farmer-to-Market Platform',
  description: 'Connect farmers directly with buyers using AI-powered insights, real-time market data, and seamless logistics',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
