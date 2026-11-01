'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "CHRONOVA butigidagi soatlar 100% original Shveytsariya mahsulotimi?",
    a: "Ha, mutlaqo. Biz faqat ishlab chiqaruvchilarning rasmiy vakolatli yetkazib beruvchilari bilan ishlaymiz. Har bir soat o‘zining individual zavod seriya raqami, xalqaro kafolat kartasi va rasmiy zavod qutisiga ega bo‘ladi. Siz soatni istalgan sertifikatlangan mustaqil ekspertizada tekshirishingiz mumkin."
  },
  {
    q: "Toshkent shahri va viloyatlarga yetkazib berish qancha vaqt oladi?",
    a: "Toshkent shahri ichida buyurtmalar 24 soat ichida (yoki Ekspress VIP xizmati tanlanganda 3 soatda) shaxsiy kuryer orqali yetkaziladi. O‘zbekiston viloyatlariga esa 2-3 ish kuni davomida maxsus sug‘urtalangan pochtalash xizmati orqali yetkazib beriladi."
  },
  {
    q: "To‘lov qanday amalga oshiriladi?",
    a: "Xarid xavfsizligini ta’minlash maqsadida biz 'Ko‘rib to‘lash' (Cash on Delivery / Card on Delivery) tizimida ishlaymiz. Kuryer buyurtmani sizga topshirganda, soatni ochib, to‘liq ko‘zdan kechirganingizdan so‘ng naqd yoki bank kartasi (Uzcard, Humo, Visa, Mastercard) orqali to‘lov qilasiz."
  },
  {
    q: "Kafolat muddati qancha va u nimalarni o‘z ichiga oladi?",
    a: "Brendga qarab xalqaro kafolat 2 yildan 5 yilgacha beriladi (masalan, Rolex va Omega uchun 5 yil). Kafolat soat mexanizmining aniqligi, zavod defektlari va ichki qismlarning uzluksiz ishlashini qoplaydi."
  },
  {
    q: "Soatni sovg‘a sifatida buyurtma qilsam bo‘ladimi?",
    a: "Albatta. Buyurtma rasmiylashtirishda izoh qismiga 'Sovg‘a qadog‘i' deb belgilashingiz mumkin. Biz uni maxsus lyuks qadoq va tabriknoma bilan birga qabul qiluvchiga yetkazib beramiz."
  }
];

export default function FaqClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400 block mb-1">
          Yordam Markazi
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-graphite-900 dark:text-ivory-100">
          Ko‘p Beriladigan Savollar
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-2">
          CHRONOVA butigi xizmatlari, original kafolati va xarid jarayonlari haqida to‘liq ma’lumot.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="font-serif text-base sm:text-lg font-semibold text-graphite-900 dark:text-ivory-100">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 leading-relaxed font-light border-t border-graphite-100 dark:border-graphite-800/60 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
