import './globals.css';
import { ThemeProvider } from '../src/context/ThemeContext';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ClientLayoutWrapper from '../src/components/ClientLayoutWrapper';
import { supabase } from '../src/lib/supabase';
import { getSettings } from '../src/lib/settings';

import type { Metadata } from 'next';

const SITE_URL = 'https://knowrise.github.io';
const FALLBACK_PHOTO = 'https://raw.githubusercontent.com/KnowRise/knowrise.github.io/main/public/img/MyFoto.png';

export async function generateMetadata(): Promise<Metadata> {
  let fullName = 'Muhamad Rifaa Siraajuddin Sugandi';
  let tagline = 'A Junior Backend Developer Portfolio exploring modern web technologies, backend systems, and solving complex problems.';
  let photo = FALLBACK_PHOTO;

  if (supabase) {
    const { data } = await supabase
      .from('profile')
      .select('full_name, tagline, photo_url')
      .eq('id', 'primary')
      .single();
    if (data) {
      if (data.full_name) fullName = data.full_name;
      if (data.tagline) tagline = data.tagline;
      if (data.photo_url) photo = data.photo_url;
    }
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: `${fullName} - Portfolio`,
    description: tagline,
    openGraph: {
      title: fullName,
      description: tagline,
      url: SITE_URL,
      siteName: 'KnowRise Portfolio',
      images: [
        {
          url: photo,
          width: 800,
          height: 600,
          alt: fullName,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} - Backend Developer`,
      description: tagline,
      images: [photo],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-source-serif-4 bg-(--bg-base) text-(--text-primary) transition-colors duration-300 overflow-x-hidden min-h-screen">
        <ThemeProvider>
          {/* CSS-only animated blob background */}
          <div className="bg-scene">
            <div className="bg-blob bg-blob-1" />
            <div className="bg-blob bg-blob-2" />
            <div className="bg-blob bg-blob-3" />
          </div>

          <ClientLayoutWrapper>
            <Navbar settings={settings} />
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
