'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide Navbar on Login and Admin pages MUST be after all hooks!
  if (pathname === '/login' || pathname?.startsWith('/admin')) {
    return null;
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/experience', label: 'Experience' },
    { to: '/work', label: 'Work' },
    { to: '/skills', label: 'Skills' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname?.startsWith(path);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[var(--bg-base)] shadow-sm px-6 rounded-b-2xl' : 'bg-transparent px-0'
      }`}
    >
      <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        {/* Brand */}
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setMenuOpen(false)}>
          <span className="text-xl font-bold font-montserrat" style={{ color: 'var(--text-primary)' }}>
            KnowRise
          </span>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Stay Positive and Be Yourself
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              className={`text-sm pb-0.5 border-b-2 transition-colors duration-200 ${
                isActive(to)
                  ? 'font-bold border-[var(--green)]'
                  : 'border-transparent hover:border-[var(--green)]'
              }`}
              style={{ color: isActive(to) ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="text-xs px-3 py-1 rounded-full border transition-colors duration-200"
            style={{
              background: 'var(--btn-inactive)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-xs px-3 py-1 rounded-full border transition-colors duration-200"
            style={{
              background: 'var(--btn-inactive)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            className="p-1 rounded"
            style={{ color: 'var(--text-primary)' }}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col gap-1 pb-4 border-b"
          style={{ borderColor: 'var(--card-border)' }}
        >
          {links.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              onClick={() => setMenuOpen(false)}
              className={`py-2 px-3 rounded-lg text-sm transition-colors duration-200 ${
                isActive(to) ? 'font-bold' : ''
              }`}
              style={{
                background: isActive(to) ? 'var(--green-dim)' : 'transparent',
                color: isActive(to) ? 'var(--green)' : 'var(--text-secondary)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
