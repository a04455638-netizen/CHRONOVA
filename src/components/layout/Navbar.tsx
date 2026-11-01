'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/context/I18nContext';
import { Language } from '@/lib/i18n/translations';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount, setIsOpen: setCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hide main store navbar on admin pages to keep professional separated SaaS feel
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  const navLinks = [
    { href: '/katalog', label: t('nav_catalog') },
    { href: '/brendlar', label: t('nav_brands') },
    { href: '/tracking', label: t('nav_tracking') },
    { href: '/biz-haqimizda', label: t('nav_about') },
    { href: '/aloqa', label: t('nav_contact') },
    { href: '/faq', label: t('nav_faq') },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/katalog?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-graphite-900 text-ivory-200 text-xs py-2 px-4 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-gold-400 animate-pulse-subtle"></span>
            <span className="font-medium text-gold-300">CHRONOVA CONCIERGE:</span>
            <span className="hidden sm:inline text-ivory-300">Toshkent bo‘ylab 24 soatda sug‘urtalangan yetkazib berish</span>
            <span className="sm:hidden text-ivory-300">24 soatda xavfsiz yetkazish</span>
          </div>

          <div className="flex items-center gap-4 text-ivory-300">
            <a href="tel:+998712009090" className="hover:text-gold-300 transition-colors font-mono">
              +998 71 200 90 90
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Mobile Menu Trigger + Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-graphite-800 dark:text-ivory-100 hover:text-gold-500 transition-colors"
              aria-label="Mobil menyu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex flex-col group">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-bold text-graphite-900 dark:text-ivory-100 group-hover:text-gold-500 transition-colors">
                CHRONOVA
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-gold-600 dark:text-gold-400 font-medium">
                Haute Horlogerie
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase transition-all duration-200 py-1 border-b-2 ${
                    active
                      ? 'text-gold-600 dark:text-gold-400 border-gold-500 font-semibold'
                      : 'text-graphite-700 dark:text-ivory-300 border-transparent hover:text-gold-500 hover:border-gold-400/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Search, Lang, Theme, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-graphite-700 dark:text-ivory-300 hover:text-gold-500 transition-colors rounded-full hover:bg-gold-500/10"
              aria-label="Qidiruv"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button
                className="text-xs uppercase font-semibold px-2 py-1 rounded border border-graphite-300 dark:border-graphite-700 text-graphite-700 dark:text-ivory-300 hover:border-gold-500 transition-colors"
                aria-label="Tilni tanlash"
              >
                {language}
              </button>
              <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-surface-darkCard rounded-lg shadow-luxury-hover border border-gold-500/20 py-1 hidden group-hover:block z-50">
                {(['uz', 'ru', 'en'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => setLanguage(lng)}
                    className={`w-full text-left px-3 py-1.5 text-xs uppercase font-medium hover:bg-gold-500/10 ${
                      language === lng ? 'text-gold-600 dark:text-gold-400 font-bold' : 'text-graphite-700 dark:text-ivory-300'
                    }`}
                  >
                    {lng === 'uz' ? 'O‘zbek' : lng === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-graphite-700 dark:text-ivory-300 hover:text-gold-500 transition-colors rounded-full hover:bg-gold-500/10"
              aria-label="Mavzuni almashtirish"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Link */}
            <Link
              href="/sevimlilar"
              className="p-2 relative text-graphite-700 dark:text-ivory-300 hover:text-gold-500 transition-colors rounded-full hover:bg-gold-500/10"
              aria-label="Sevimlilar"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fade-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-gold-500/10 hover:bg-gold-500 hover:text-white dark:bg-gold-500/20 dark:hover:bg-gold-500 text-gold-600 dark:text-gold-300 transition-all rounded-full group"
              aria-label="Xarid savati"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold">
                {totalItemsCount} dona
              </span>
              {totalItemsCount > 0 && (
                <span className="sm:hidden bg-gold-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-fade-in">
          <div className="bg-white dark:bg-surface-darkCard w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-gold-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-semibold text-graphite-900 dark:text-ivory-100">
                CHRONOVA Butik Qidiruvi
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full text-graphite-500 hover:text-graphite-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full bg-ivory-100 dark:bg-surface-dark border border-gold-500/30 rounded-xl px-4 py-3.5 pl-11 text-sm text-graphite-900 dark:text-ivory-100 focus:outline-none focus:border-gold-500"
              />
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gold-500" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Qidirish
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-graphite-200 dark:border-graphite-800">
              <span className="text-xs text-graphite-500 dark:text-ivory-400 font-medium">Mashhur so‘rovlar:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Rolex Submariner', 'Omega Moonwatch', 'Patek Philippe', 'Avtomatik', 'Sapfir oyna'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      window.location.href = `/katalog?q=${encodeURIComponent(term)}`;
                      setSearchOpen(false);
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-ivory-200 dark:bg-graphite-800 hover:bg-gold-500 hover:text-white text-graphite-700 dark:text-ivory-300 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-surface-darkCard p-6 shadow-2xl flex flex-col justify-between border-r border-gold-500/20">
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-graphite-200 dark:border-graphite-800">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col">
                  <span className="font-serif text-2xl font-bold tracking-widest text-graphite-900 dark:text-ivory-100">
                    CHRONOVA
                  </span>
                  <span className="text-[8px] tracking-[0.3em] uppercase text-gold-500">Haute Horlogerie</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-graphite-500 hover:text-graphite-900 dark:hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium tracking-wider uppercase text-graphite-800 dark:text-ivory-200 hover:text-gold-500 py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-graphite-200 dark:border-graphite-800 flex flex-col gap-4">
              <div className="text-center text-xs text-graphite-500 dark:text-ivory-400">
                VIP Konsyerj: <a href="tel:+998712009090" className="text-gold-500 font-mono">+998 71 200 90 90</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
