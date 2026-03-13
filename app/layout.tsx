import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { DesktopNav } from '@/components/navigation/desktop-nav';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SalonPro - Management Platform',
  description: 'Mobile-first SaaS platform for salon management',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <DesktopNav />
          <main className="flex-1 md:ml-64 flex flex-col bg-background">
            {children}
          </main>
          <MobileNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
