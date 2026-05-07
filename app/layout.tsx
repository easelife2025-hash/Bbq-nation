import type {Metadata} from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

import { AuthProvider } from '@/components/auth-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Barbeque Nation - Live Grill & Buffet',
  description: 'Experience the finest live grill right at your table with Barbeque Nation.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} scroll-smooth`}>
      <body className="bg-zinc-950 text-neutral-200 font-sans antialiased selection:bg-orange-500/30 selection:text-orange-200" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-400px)]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
