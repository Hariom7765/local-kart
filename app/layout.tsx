import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Local Cart AI - Hyper-Local Retail & Live Inventory Search',
  description:
    'Discover neighborhood Kirana, Pharmacy, Electronics, and Fashion shops near you with AI search, real-time stock availability, and instant WhatsApp ordering.',
  keywords: [
    'Local Cart AI',
    'Kirana Store Near Me',
    'Local Retail India',
    'Haversine Geolocation',
    'Neighborhood Shop Discovery',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
