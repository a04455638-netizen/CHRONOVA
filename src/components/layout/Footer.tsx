'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Clock, Award, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-graphite-950 text-ivory-300 border-t border-gold-500/20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-graphite-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-ivory-100">{t('authenticity_guarantee')}</h4>
              <p className="text-xs text-graphite-400 mt-1 leading-relaxed">
                {t('authenticity_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-ivory-100">{t('concierge_service')}</h4>
              <p className="text-xs text-graphite-400 mt-1 leading-relaxed">
                Toshkent bo‘ylab 24 soat ichida shaxsiy kuryer orqali xavfsiz va sug‘urtalangan yetkazib berish.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-ivory-100">{t('swiss_heritage_badge')}</h4>
              <p className="text-xs text-graphite-400 mt-1 leading-relaxed">
                5 yilgacha xalqaro servis va rasmiy ishlab chiqaruvchi kafolati.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-ivory-100">
                CHRONOVA
              </span>
              <span className="block text-[9px] tracking-[0.3em] uppercase text-gold-400">
                Haute Horlogerie
              </span>
            </Link>
            <p className="text-xs text-graphite-400 leading-relaxed">
              CHRONOVA — O‘zbekistondagi Shveytsariya lyuks soatlarining eng nufuzli onlayn butigi. Har bir buyurtma mukammallik bilan yetkaziladi.
            </p>
          </div>

          {/* Catalog & Brands */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-4">
              Kolleksiya
            </h4>
            <ul className="space-y-2.5 text-xs text-graphite-400">
              <li>
                <Link href="/katalog" className="hover:text-gold-300 transition-colors">Barcha soatlar</Link>
              </li>
              <li>
                <Link href="/katalog?cat=klassik" className="hover:text-gold-300 transition-colors">Klassik va Dress</Link>
              </li>
              <li>
                <Link href="/katalog?cat=xronograf" className="hover:text-gold-300 transition-colors">Xronograflar</Link>
              </li>
              <li>
                <Link href="/katalog?cat=diver" className="hover:text-gold-300 transition-colors">Diver soatlar</Link>
              </li>
              <li>
                <Link href="/katalog?cat=ayollar" className="hover:text-gold-300 transition-colors">Ayollar kolleksiyasi</Link>
              </li>
              <li>
                <Link href="/brendlar" className="hover:text-gold-300 transition-colors">Shveytsariya brendlari</Link>
              </li>
            </ul>
          </div>

          {/* Client Service */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-4">
              Xizmatlar & Yordam
            </h4>
            <ul className="space-y-2.5 text-xs text-graphite-400">
              <li>
                <Link href="/tracking" className="hover:text-gold-300 transition-colors">Buyurtmani kuzatish</Link>
              </li>
              <li>
                <Link href="/kafolat-va-yetkazish" className="hover:text-gold-300 transition-colors">Kafolat va Yetkazish</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-300 transition-colors">Ko‘p beriladigan savollar (FAQ)</Link>
              </li>
              <li>
                <Link href="/biz-haqimizda" className="hover:text-gold-300 transition-colors">Butik haqida</Link>
              </li>
              <li>
                <Link href="/aloqa" className="hover:text-gold-300 transition-colors">Biz bilan bog‘lanish</Link>
              </li>
            </ul>
          </div>

          {/* Showroom Contacts */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-4">
              Butik Manzili
            </h4>
            <div className="space-y-3 text-xs text-graphite-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>Toshkent shahri, Amir Temur shoh ko‘chasi, 108</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="tel:+998712009090" className="hover:text-gold-300 font-mono">+998 71 200 90 90</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="mailto:concierge@chronova.uz" className="hover:text-gold-300 font-mono">concierge@chronova.uz</a>
              </div>
              <div className="pt-2">
                <span className="text-[11px] text-graphite-500 block">Ish tartibi:</span>
                <span className="text-[11px] text-ivory-300 font-medium">Har kuni 10:00 — 21:00 (Dam olish kunlarisiz)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 border-t border-graphite-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-graphite-500">
          <div>
            © {new Date().getFullYear()} CHRONOVA Haute Horlogerie. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-graphite-900 text-ivory-300 text-[10px] font-mono">NAQD</span>
            <span className="px-2 py-0.5 rounded bg-graphite-900 text-ivory-300 text-[10px] font-mono">UZCARD</span>
            <span className="px-2 py-0.5 rounded bg-graphite-900 text-ivory-300 text-[10px] font-mono">HUMO</span>
            <span className="px-2 py-0.5 rounded bg-graphite-900 text-ivory-300 text-[10px] font-mono">VISA / MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
