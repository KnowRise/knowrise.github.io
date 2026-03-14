'use client';
import { usePathname } from 'next/navigation';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth = pathname === '/login' || pathname?.startsWith('/admin');

  return (
    <div className="relative z-10 flex justify-center font-source-serif-4 min-h-screen w-full">
      <div className={`w-full ${isFullWidth ? '' : 'md:w-[75%] max-w-[1200px] px-6'} flex flex-col min-h-screen`}>
        {children}
      </div>
    </div>
  );
}
