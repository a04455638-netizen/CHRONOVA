import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Biz Haqimizda — CHRONOVA Butigi',
  description: 'CHRONOVA — O‘zbekistondagi Shveytsariya lyuks soatlarining nufuzli butigi va xalqaro servis kafolati.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12">
      {/* Editorial Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
          CHRONOVA Filosofiyasi
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-graphite-900 dark:text-ivory-100 leading-tight">
          Vaqt O‘lchovi Emas, Meros va Mukammallik San’ati
        </h1>
        <p className="text-sm sm:text-base text-graphite-600 dark:text-ivory-300 font-light leading-relaxed max-w-2xl mx-auto">
          CHRONOVA butigi O‘zbekistondagi haqiqiy soat ishqibozlari va kolleksionerlar uchun Shveytsariyaning asriy soatsozlik durdonalarini taqdim etadi.
        </p>
      </section>

      {/* Visual & Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gold-500/30">
            <Image
              src="/images/watches/patek-calatrava.jpg"
              alt="CHRONOVA Haute Horlogerie Craftsmanship"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mukammallik Standartlari</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-graphite-900 dark:text-ivory-100">
              Har Bir Model — Sinchkovlik Bilan Tanlangan Asl Nusxa
            </h2>

            <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed font-light">
              Biz faqat eng sara modellarni tanlab olamiz. Har bir soat Shveytsariya COSC yoki Master Chronometer sertifikatiga ega bo‘lib, ishlab chiqaruvchining zavod seriya raqami va rasmiy pasporti bilan birga topshiriladi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800">
                <ShieldCheck className="w-6 h-6 text-gold-500 mb-2" />
                <h4 className="font-serif text-sm font-bold text-graphite-900 dark:text-ivory-100 mb-1">5 Yillik Kafolat</h4>
                <p className="text-[11px] text-graphite-500">Xalqaro zavod kafolati va rasmiy servis qo‘llab-quvvatlovi.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800">
                <Clock className="w-6 h-6 text-gold-500 mb-2" />
                <h4 className="font-serif text-sm font-bold text-graphite-900 dark:text-ivory-100 mb-1">VIP Konsyerj</h4>
                <p className="text-[11px] text-graphite-500">Toshkent bo‘ylab xavfsiz va tezkor kuryerlik yetkazib berish.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-ivory-100 dark:bg-surface-darkCard border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-graphite-900 dark:text-ivory-100">
              Butikimizga Tashrif Buyuring
            </h3>
            <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-1">
              Toshkent sh., Amir Temur shoh ko‘chasi, 108. Konsyerj: +998 71 200 90 90
            </p>
          </div>
          <Link
            href="/katalog"
            className="px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-luxury transition-all whitespace-nowrap"
          >
            <span>Kolleksiyani Ko‘rish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
