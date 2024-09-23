import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { frontendConfig } from './config/frontend';
import { SuperTokensInit } from "./components/supertokensInit";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: process.env.APP_NAME,
  description: "The ultimate AI business intelligence platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SuperTokensInit>
        <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
      </SuperTokensInit>
    </html>
  )
}