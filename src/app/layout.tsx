import "@/styles/globals.scss"
import "nprogress/nprogress.css"
import type { Metadata } from 'next'
import { Providers } from './providers'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'Redirect Checker - URL Redirect Analysis Tool',
  description: 'Free online tool to check URL redirects, analyze redirect chains, and monitor website uptime.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
