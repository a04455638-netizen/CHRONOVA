import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import HeroBanner from '@/components/store/HeroBanner';
import ProductCard from '@/components/store/ProductCard';
import { DataStore } from '@/lib/data/store';

export default async function HomePage() {
  const featuredProducts = await DataStore.getFeaturedProducts();
  const brands = await DataStore.getBrands();
  const categories = await DataStore.getCategories();

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Prestigious Brands Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
            Rasmiy Vakolatli Hamkorlar
          </span>
          <h2 className="font-serif text-2xl font-bold text-graphite-900 dark:text-ivory-100 mt-1">
            Dunyodagi Eng Sara Soat Uyushmalari
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

      {/* 3. Featured Collection Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-600 dark:text-gold-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Maxsus Tanlov</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-graphite-900 dark:text-ivory-100">
              Saralangan Durdonalar
            </h2>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gold-600 dark:text-gold-400 hover:text-gold-500 transition-colors"
          >
            <span>Barcha soatlarni ko‘rish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Category Showcase Grid */}
      <section className="bg-ivory-100 dark:bg-surface-dark py-16 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
              Kategoriyalar
            </span>
            <h2 className="font-serif text-3xl font-bold text-graphite-900 dark:text-ivory-100 mt-1">
              Har Bir Hayotiy Lahza Uchun
            </h2>
            <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-2">
              Biznes uchrashuvlardan tortib okean tubigacha — o‘z uslubingizga mos soatni tanlang.
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
                    Kategoriya
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mb-4">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 group-hover:text-white transition-colors">
                    <span>Modellarni ko‘rish</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Heritage & Certification */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-graphite-900 rounded-3xl p-8 sm:p-12 lg:p-16 border border-gold-500/30 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Rasmiy Shveysariya Kafolati</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Har bir soniyada mutlaq aniqlik va xotirjamlik
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              CHRONOVA butigida xarid qilingan har bir soat to‘liq zavod to‘plamida yetkaziladi: xalqaro kafolat kartasi, seriya raqami sertifikati va rasmiy qadoq. Biz kontrafakt va o‘xshatmalarga mutlaqo murosasizmiz.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-gray-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>COSC va Master Chronometer xalqaro sertifikatlari</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Toshkentdagi manzilga xavfsiz va maxsus inkassatorlik kuryeri</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Qabul qilib olganda to‘liq ko‘rik va keyin to‘lov imkoniyati</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                href="/kafolat-va-yetkazish"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <span>Kafolat Shartlari Bilan Tanishish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
