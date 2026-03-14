import './globals.css';
import { ThemeProvider } from '../src/context/ThemeContext';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ClientLayoutWrapper from '../src/components/ClientLayoutWrapper';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Muhamad Rifaa Siraajuddin Sugandi - Portfolio',
  description: 'A Junior Backend Developer Portfolio exploring modern web technologies, backend systems, and solving complex problems.',
  openGraph: {
    title: 'Muhamad Rifaa Siraajuddin Sugandi',
    description: 'A Junior Backend Developer Portfolio exploring modern web technologies.',
    url: 'https://knowrise.github.io', // Update with actual domain if different
    siteName: 'KnowRise Portfolio',
    images: [
      {
        url: 'https://raw.githubusercontent.com/KnowRise/knowrise.github.io/main/public/img/MyFoto.png',
        width: 800,
        height: 600,
        alt: 'Muhamad Rifaa Siraajuddin Sugandi',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhamad Rifaa Siraajuddin Sugandi - Backend Developer',
    description: 'A Junior Backend Developer Portfolio exploring modern web technologies, backend systems, and problem-solving.',
    images: ['https://raw.githubusercontent.com/KnowRise/knowrise.github.io/main/public/img/MyFoto.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-source-serif-4 bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden min-h-screen">
        <ThemeProvider>
          {/* CSS-only animated blob background */}
          <div className="bg-scene">
            <div className="bg-blob bg-blob-1" />
            <div className="bg-blob bg-blob-2" />
            <div className="bg-blob bg-blob-3" />
          </div>

          <ClientLayoutWrapper>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
