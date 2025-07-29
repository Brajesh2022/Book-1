import type { Metadata } from 'next';
import { Inter, Crimson_Text } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const crimsonText = Crimson_Text({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'],
  variable: '--font-crimson'
});

export const metadata: Metadata = {
  title: 'Book Archive - Discover Your Next Read',
  description: 'A beautiful, fast book search application with Kindle-inspired design. Search millions of books and discover your next favorite read.',
  keywords: ['books', 'reading', 'library', 'search', 'kindle', 'archive'],
  authors: [{ name: 'Book Archive Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Book Archive - Discover Your Next Read',
    description: 'Search millions of books with our beautiful, Kindle-inspired interface',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Archive - Discover Your Next Read',
    description: 'Search millions of books with our beautiful, Kindle-inspired interface',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#f7f4ed" />
      </head>
      <body className="min-h-screen bg-kindle-paper font-serif antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-kindle-border bg-white py-6 px-4">
            <div className="container mx-auto text-center text-sm text-kindle-muted">
              <p>© 2024 Book Archive. Discover your next favorite read.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}