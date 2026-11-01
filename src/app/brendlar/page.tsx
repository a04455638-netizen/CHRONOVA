import React from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/data/store';
import { ArrowRight, Award, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Brendlar — CHRONOVA Shveytsariya Butigi',
  description: 'Dunyoning eng nufuzli soat manufakturalari: Rolex, Omega, Patek Philippe, Audemars Piguet, Cartier, Tissot.',
};

export default async function BrandsPage() {
  const brands = await DataStore.getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400 block mb-1">
          Haute Horlogerie Merosi
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-graphite-900 dark:text-ivory-100">
          Shveytsariya Manufakturalari
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-3 leading-relaxed">
          Asrlar davomida shakllangan soatsozlik an’analari va zamonaviy texnologiyalarning uyg‘unligi. CHRONOVA faqat rasmiy sertifikatlangan asl modellarni taqdim etadi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 hover:border-gold-500/50 shadow-luxury hover:shadow-luxury-hover transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-400 font-bold">
                  {brand.origin_country}
                </span>
                <Award className="w-5 h-5 text-gold-500/60 group-hover:text-gold-500 transition-colors" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-graphite-900 dark:text-ivory-100 mb-3 group-hover:text-gold-500 transition-colors">
                {brand.name}
              </h2>
              <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed font-light mb-6">
                {brand.description}
              </p>
            </div>

            <Link
              href={`/katalog?brand=${brand.slug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 group-hover:text-gold-500 transition-colors pt-4 border-t border-graphite-100 dark:border-graphite-800"
            >
              <span>{brand.name} modellarini ko‘rish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
