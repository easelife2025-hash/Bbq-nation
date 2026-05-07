'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X, Flame, LogOut, Loader2, LogIn } from 'lucide-react';
import { useAuth } from './auth-provider';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loginWithGoogle, logout, loading } = useAuth() as any;

  // Let's use correct property names from auth provider
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Updates', path: '/my-updates' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-orange-950/50 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Flame className="w-8 h-8 text-orange-500 group-hover:text-amber-400 transition-colors duration-300" />
          <span className="font-display text-2xl font-bold tracking-wider text-neutral-100 uppercase">
            Barbeque <span className="text-orange-500">Nation</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm tracking-[0.15em] uppercase font-medium transition-colors hover:text-orange-400 relative ${
                pathname === link.path ? 'text-orange-500' : 'text-neutral-400'
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-500"
                />
              )}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-400 truncate max-w-[120px]" title={user.email || ''}>{user.email}</span>
                <button 
                  onClick={logout}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 text-neutral-300 hover:text-white text-xs font-bold tracking-wider uppercase rounded-sm transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}

            <Link
              href="/book"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300 shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)]"
            >
              Book Table
            </Link>
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="xl:hidden text-neutral-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-zinc-950 border-b border-orange-900/40 py-6 px-6 flex flex-col gap-6 xl:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-sm tracking-widest uppercase font-medium ${
                  pathname === link.path ? 'text-orange-500' : 'text-neutral-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="w-full h-px bg-neutral-900 my-2"></div>
            
            {!loading && (
              user ? (
                <div className="flex flex-col gap-4">
                  <div className="text-sm text-neutral-400">Logged in as: {user.email}</div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white tracking-widest uppercase"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 bg-neutral-900 border border-neutral-800 text-white text-sm font-bold tracking-widest uppercase rounded-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )
            )}

            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-center px-6 py-3 bg-orange-600 text-white font-bold tracking-widest uppercase rounded-sm"
            >
              Book Table
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
