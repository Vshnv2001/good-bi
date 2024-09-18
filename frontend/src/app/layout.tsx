import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SuperTokensProvider } from "./components/supertokensProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GoodBI',
  description: 'GoodBI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SuperTokensProvider>
        <body className={inter.className}>{children}</body>
      </SuperTokensProvider>
    </html>
  )
}