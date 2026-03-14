import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | KnowRise',
  description: 'Admin Content Management System',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
