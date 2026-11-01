'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Clock, Award, Sparkles } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function HeroBanner() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ivory-100 via-surface-light to-white dark:from-graphite-950 dark:via-surface-dark dark:to-surface-darkMuted pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-gold-500/20">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 dark:bg-gold-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Micro Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 dark:bg-gold-500/20 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-semibold uppercase tracking-widest animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{t('hero_badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-graphite-900 dark:text-ivory-100 leading-[1.12]">
              {t('hero_title_1')}{' '}
              <span className="italic font-normal text-gold-600 dark:text-gold-400">
                {t('hero_title_italic')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-graphite-600 dark:text-ivory-300 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              {t('hero_subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/katalog"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-widest shadow-luxury hover:shadow-luxury-hover transition-all flex items-center justify-center gap-3 group"
              >
                <span>{t('hero_cta')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/brendlar"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-graphite-300 dark:border-graphite-700 hover:border-gold-500 text-graphite-800 dark:text-ivory-200 hover:text-gold-500 font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center"
              >
                {t('hero_secondary_cta')}
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-4 border-t border-graphite-200 dark:border-graphite-800/80 text-left">
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-graphite-900 dark:text-ivory-100">100%</span>
                <span className="text-[11px] sm:text-xs text-graphite-500 dark:text-ivory-400">{t('stat_swiss')}</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-graphite-900 dark:text-ivory-100">5 Yil</span>
                <span className="text-[11px] sm:text-xs text-graphite-500 dark:text-ivory-400">{t('stat_warranty')}</span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold text-graphite-900 dark:text-ivory-100">24 Soat</span>
                <span className="text-[11px] sm:text-xs text-graphite-500 dark:text-ivory-400">{t('stat_delivery')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Watch Feature */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-gold-500/30 group">
              <Image
                src="/images/watches/rolex-submariner.jpg"
                alt="Rolex Submariner Date Luxury Swiss Watch"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Information Capsule */}
              <div className="absolute bottom-6 inset-x-6 p-4 rounded-2xl bg-white/10 dark:bg-black/50 backdrop-blur-md border border-white/20 text-white flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-300 font-semibold block">
                    Eng Sara Model
                  </span>
                  <span className="font-serif text-base font-bold">
                    Rolex Submariner Date
                  </span>
                  <span className="text-xs text-gray-300 block font-mono">
                    Calibre 3235 • 300m Suvga chidamli
                  </span>
                </div>
                <Link
                  href="/mahsulot/rolex-submariner-date-41"
                  className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold transition-colors"
                >
                  Ko‘rish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
