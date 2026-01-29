import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import PWAUpdatePrompt from '@/components/PWAUpdatePrompt';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#c6b477'
};

export const metadata: Metadata = {
  title: 'HM Management - Client',
  description: 'Client Portal for HM Management',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HM Client'
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${montserrat.className} app-shell`}>
        {children}
        <PWAUpdatePrompt />
      </body>
    </html>
  );
}
