'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, Send, ArrowRight, Home, Search, ShieldCheck } from 'lucide-react';

export default function ConfirmationClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'CHR-26-88190';
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full bg-gold-500/10 dark:bg-gold-500/20 text-gold-500 flex items-center justify-center mx-auto border-2 border-gold-500/30">
          <CheckCircle2 className="w-12 h-12 text-gold-500" />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
          Muvaffaqiyatli Qabul Qilindi
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-graphite-900 dark:text-ivory-100">
          Buyurtmangiz Rasmiylashtirildi!
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 max-w-lg mx-auto leading-relaxed">
          CHRONOVA butikini tanlaganingiz uchun tashakkur. Shaxsiy konsyerj menejerimiz yaqin daqiqalarda siz bilan telefon orqali bog‘lanadi.
        </p>
      </div>

      {/* Order Reference Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-surface-darkCard border border-gold-500/30 shadow-luxury max-w-lg mx-auto text-left space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-graphite-100 dark:border-graphite-800">
          <span className="text-xs text-graphite-500">Buyurtma Raqami:</span>
          <span className="font-mono text-base font-bold text-gold-600 dark:text-gold-400">
            {orderNumber}
          </span>
        </div>

        {/* Telegram Notification indicator */}
        <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center gap-3 text-xs text-graphite-700 dark:text-ivory-200">
          <Send className="w-4 h-4 text-gold-500 flex-shrink-0" />
          <span>Admin Telegram botiga yangi buyurtma xabarnomasi muvaffaqiyatli uzatildi.</span>
        </div>

        <div className="space-y-2 text-xs text-graphite-600 dark:text-ivory-400 pt-2">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-gold-500" />
            <span>Soat zavod qutisi va xalqaro kafolat kartasi bilan yetkaziladi</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>To‘lov faqat soatni to‘liq tekshirgach amalga oshiriladi</span>
          </div>
        </div>
      </div>

      {/* Navigation actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/tracking?id=${encodeURIComponent(orderNumber)}`}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Buyurtma Holatini Kuzatish</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-graphite-300 dark:border-graphite-700 hover:border-gold-500 text-graphite-800 dark:text-ivory-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Bosh Sahifaga Qaytish</span>
        </Link>
      </div>
    </div>
  );
}
