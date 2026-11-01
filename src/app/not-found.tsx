'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Compass, ArrowRight, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function NotFound() {
  const { t } = useI18n();
  const [secondsRotation, setSecondsRotation] = useState(0);

  useEffect(() => {
    // Elegant clock movement effect
    const interval = setInterval(() => {
      setSecondsRotation((prev) => (prev + 6) % 360);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const popularBrands = [
    { name: 'Rolex', slug: 'rolex' },
    { name: 'Omega', slug: 'omega' },
    { name: 'Patek Philippe', slug: 'patek-philippe' },
    { name: 'Audemars Piguet', slug: 'audemars-piguet' },
    { name: 'Cartier', slug: 'cartier' },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient luxury lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-gold-500/10 via-gold-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gold-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-2xl w-full text-center z-10">
        {/* Luxury Horological Dial Visualization */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-8 flex items-center justify-center">
          {/* Outer Roman Numeral Ring */}
          <div className="absolute inset-0 rounded-full border border-gold-500/30 dark:border-gold-500/20 bg-gradient-to-b from-white/60 to-ivory-100/80 dark:from-surface-dark dark:to-graphite-950 backdrop-blur-md shadow-2xl shadow-gold-500/10 flex items-center justify-center">
            {/* Roman Numerals */}
            <span className="absolute top-2 text-[11px] font-serif font-bold text-gold-600 dark:text-gold-400 tracking-wider">
              XII
            </span>
            <span className="absolute right-3 text-[11px] font-serif font-bold text-gold-600 dark:text-gold-400 tracking-wider">
              III
            </span>
            <span className="absolute bottom-2 text-[11px] font-serif font-bold text-gold-600 dark:text-gold-400 tracking-wider">
              VI
            </span>
            <span className="absolute left-3 text-[11px] font-serif font-bold text-gold-600 dark:text-gold-400 tracking-wider">
              IX
            </span>

            {/* Subtle Minute Markers */}
            <div className="w-[84%] h-[84%] rounded-full border border-dashed border-gold-400/25 dark:border-gold-500/20 relative flex items-center justify-center">
              {/* Watch Hour & Minute Hands */}
              <div
                className="absolute w-1 h-12 bg-gradient-to-t from-gold-600 to-gold-400 rounded-full origin-bottom -translate-y-1/2 shadow-sm"
                style={{ transform: 'rotate(125deg)' }}
              />
              <div
                className="absolute w-0.5 h-16 bg-gradient-to-t from-graphite-800 to-graphite-400 dark:from-ivory-200 dark:to-white rounded-full origin-bottom -translate-y-1/2 shadow-sm"
                style={{ transform: 'rotate(295deg)' }}
              />
              {/* Animated Second Hand */}
              <div
                className="absolute w-[1.5px] h-18 bg-red-500 origin-bottom -translate-y-1/2 transition-transform duration-300 ease-linear shadow-sm"
                style={{ transform: `rotate(${secondsRotation}deg)` }}
              />
              {/* Dial Center Pin */}
              <div className="relative w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-white dark:border-surface-dark shadow-md z-10" />
            </div>
          </div>

          {/* Glowing Orbit Rings */}
          <div className="absolute -inset-3 rounded-full border border-gold-500/15 dark:border-gold-400/10 animate-pulse pointer-events-none" />
          <div className="absolute -inset-6 rounded-full border border-dashed border-gold-500/10 dark:border-gold-400/5 pointer-events-none" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 dark:bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-400 text-xs font-semibold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{t('not_found_badge')}</span>
        </div>

        {/* 404 Large Luxury Heading */}
        <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4">
          <span className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 dark:from-ivory-100 dark:via-gold-300 dark:to-gold-500 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-graphite-900 dark:text-ivory-100 mb-3 tracking-wide">
          {t('not_found_title')}
        </h2>

        <p className="text-sm sm:text-base text-graphite-600 dark:text-graphite-300 max-w-lg mx-auto mb-8 leading-relaxed">
          {t('not_found_desc')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-medium text-sm tracking-wide shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/30 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>{t('not_found_home_btn')}</span>
          </Link>

          <Link
            href="/katalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-graphite-300 dark:border-graphite-700 hover:border-gold-500 text-graphite-800 dark:text-ivory-100 hover:text-gold-600 dark:hover:text-gold-400 font-medium text-sm tracking-wide transition-all duration-200 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-sm"
          >
            <Compass className="w-4 h-4" />
            <span>{t('not_found_catalog_btn')}</span>
          </Link>
        </div>

        {/* Popular Quick Navigation */}
        <div className="pt-8 border-t border-graphite-200/80 dark:border-graphite-800/80">
          <p className="text-xs uppercase tracking-widest font-semibold text-graphite-400 dark:text-graphite-400 mb-4">
            {t('not_found_popular_searches')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/katalog?brand=${brand.slug}`}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-graphite-700 dark:text-ivory-200 bg-ivory-100 dark:bg-surface-darkCard hover:bg-gold-500/10 hover:text-gold-600 dark:hover:text-gold-400 border border-transparent hover:border-gold-500/30 transition-all duration-200"
              >
                {brand.name}
              </Link>
            ))}
            <Link
              href="/tracking"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-gold-600 dark:text-gold-400 bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20 transition-all duration-200 inline-flex items-center gap-1"
            >
              <span>Buyurtmani kuzatish</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Concierge Help Footnote */}
        <div className="mt-8 pt-6 flex items-center justify-center gap-2 text-xs text-graphite-500 dark:text-graphite-400">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <span>{t('not_found_support')}</span>
          <a
            href="tel:+998712000000"
            className="inline-flex items-center gap-1 font-semibold text-gold-600 dark:text-gold-400 hover:underline ml-1"
          >
            <PhoneCall className="w-3 h-3" />
            +998 (71) 200-00-00
          </a>
        </div>
      </div>
    </div>
  );
}
