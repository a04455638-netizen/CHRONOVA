import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Kafolat va Yetkazib Berish Siyosati — CHRONOVA',
  description: 'CHRONOVA lyuks soat butigining rasmiy kafolat, yetkazib berish va xavfsizlik shartlari.',
};

export default function WarrantyDeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400 block mb-1">
          Rasmiy Nizom
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-graphite-900 dark:text-ivory-100">
          Kafolat va Yetkazib Berish
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-2">
          CHRONOVA butigi mijozlarga eng yuqori darajadagi ishonch va qulaylikni taqdim etadi.
        </p>
      </div>

      {/* Section 1: Warranty */}
      <section className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 shadow-luxury space-y-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-gold-500" />
          <h2 className="font-serif text-xl font-bold text-graphite-900 dark:text-ivory-100">
            1. Rasmiy Manufaktura Kafolati
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed font-light">
          CHRONOVA butigida xarid qilingan barcha yangi soatlar ishlab chiqaruvchining to‘liq xalqaro kafolati (2 yildan 5 yilgacha) bilan birga keladi.
        </p>
        <ul className="space-y-2 text-xs text-graphite-600 dark:text-ivory-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500" />
            <span>Mexanizmning aniqligi va zavod standartlariga muvofiqligi</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500" />
            <span>Har bir model uchun xalqaro pasport va QR seriya raqami</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-500" />
            <span>Avtorizatsiyalangan servis markazlarida bepul texnik xizmat ko‘rsatish</span>
          </li>
        </ul>
      </section>

      {/* Section 2: Delivery */}
      <section className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 shadow-luxury space-y-4">
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-gold-500" />
          <h2 className="font-serif text-xl font-bold text-graphite-900 dark:text-ivory-100">
            2. Xavfsiz va Sug‘urtalangan Yetkazish
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed font-light">
          Soatlar qimmatbaho toifa mahsulot bo‘lgani bois, ular maxsus himoyalangan qadoqlarda shaxsiy kuryerimiz orqali yetkaziladi.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-ivory-100 dark:bg-surface-dark">
            <h4 className="font-bold text-graphite-900 dark:text-ivory-100 mb-1">Toshkent shahri bo‘ylab:</h4>
            <p className="text-graphite-500">24 soat ichida mutlaqo bepul. Ekspress VIP yetkazish 3 soat ichida amalga oshiriladi.</p>
          </div>
          <div className="p-4 rounded-xl bg-ivory-100 dark:bg-surface-dark">
            <h4 className="font-bold text-graphite-900 dark:text-ivory-100 mb-1">Viloyatlar bo‘ylab:</h4>
            <p className="text-graphite-500">2-3 ish kunida maxsus sug‘urtalangan pochtalash xizmati orqali yetkaziladi.</p>
          </div>
        </div>
      </section>

      {/* Section 3: Return & Inspection */}
      <section className="p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 shadow-luxury space-y-4">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-gold-500" />
          <h2 className="font-serif text-xl font-bold text-graphite-900 dark:text-ivory-100">
            3. Ko‘zdan Kechirish va Qaytarish Qoidalari
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed font-light">
          Mijoz tovar kuryerdan olingan paytda soatning tashqi ko‘rinishi, seriya raqami va to‘liq butligini tekshirish huquqiga ega. Agar mahsulotda zavod nuqsoni aniqlansa, darhol boshqa yangi nusxasiga almashtirib beriladi yoki to‘lov to‘liq qaytariladi.
        </p>
      </section>
    </div>
  );
}
