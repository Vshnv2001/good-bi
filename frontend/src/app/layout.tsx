import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { frontendConfig } from './config/frontend';
import { SuperTokensInit } from "./components/supertokensInit";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

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
    <Script async src={"https://www.googletagmanager.com/gtag/js?id=G-4XH651C6CN"}/>
    <Script id='' strategy='lazyOnload'>
      {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4XH651C6CN');
          `}
    </Script>
    <SuperTokensInit>
      <body className={`${inter.variable} font-sans antialiased`}>
      <div id="fb-root"></div>
      <Script async defer crossOrigin="anonymous"
              src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0"></Script>
      {children}
      </body>
    </SuperTokensInit>
    <Toaster/>
    </html>
  )
}