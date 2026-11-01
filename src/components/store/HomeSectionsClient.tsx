'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { Product, Brand, Category } from '@/types';
import { useI18n } from '@/context/I18nContext';

interface HomeSectionsClientProps {
  featuredProducts: Product[];
  brands: Brand[];
  categories: Category[];
}

export default function HomeSectionsClient({
  featuredProducts,
  brands,
  categories,
}: HomeSectionsClientProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Prestigious Brands Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
            {t('home_partners_badge')}
          </span>
          <h2 className="font-serif text-2xl font-bold text-graphite-900 dark:text-ivory-100 mt-1">
            {t('home_partners_title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/katalog?brand=${brand.slug}`}
              className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 hover:border-gold-500/50 flex flex-col items-center justify-center text-center group transition-all hover:shadow-luxury"
            >
              <span className="font-serif text-base font-bold text-graphite-800 dark:text-ivory-200 group-hover:text-gold-500 transition-colors">
                {brand.name}
              </span>
              <span className="text-[10px] text-graphite-400 mt-1 tracking-wider uppercase">
                {brand.origin_country}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Featured Collection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-600 dark:text-gold-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('home_featured_badge')}</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-graphite-900 dark:text-ivory-100">
              {t('home_featured_title')}
            </h2>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gold-600 dark:text-gold-400 hover:text-gold-500 transition-colors"
          >
            <span>{t('home_view_all_watches')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Category Showcase Grid */}
      <section className="bg-ivory-100 dark:bg-surface-dark py-16 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
              {t('home_categories_badge')}
            </span>
            <h2 className="font-serif text-3xl font-bold text-graphite-900 dark:text-ivory-100 mt-1">
              {t('home_categories_title')}
            </h2>
            <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-2">
              {t('home_categories_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                href={`/katalog?cat=${cat.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg border border-gold-500/20 block"
              >
                <Image
                  src={cat.image_url || '/images/watches/rolex-submariner.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/40 to-transparent" />

                <div className="absolute bottom-6 inset-x-6">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block mb-1">
                    {t('home_categories_badge')}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-4">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 group-hover:text-white transition-colors">
                    <span>{t('home_view_models')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editorial Heritage & Certification */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-graphite-900 rounded-3xl p-8 sm:p-12 lg:p-16 border border-gold-500/30 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('home_heritage_badge')}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t('home_heritage_title')}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              {t('home_heritage_desc')}
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-gray-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>{t('home_heritage_feat1')}</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>{t('home_heritage_feat2')}</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>{t('home_heritage_feat3')}</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                href="/kafolat-va-yetkazish"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-widest transition-colors shadow-lg"
              >
                <span>{t('home_heritage_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative luxury watch dial outline */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] rounded-full border border-gold-500/10 pointer-events-none hidden lg:flex items-center justify-center">
            <div className="w-[380px] h-[380px] rounded-full border border-dashed border-gold-500/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
