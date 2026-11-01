'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactClient() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400 block mb-1">
          VIP Aloqa
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-graphite-900 dark:text-ivory-100">
          Konsyerj Bilan Bog‘lanish
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-2">
          Savollaringiz bormi yoki maxsus model buyurtma qilmoqchimisiz? Bizning ekspertlarimiz 24/7 xizmatingizda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contacts Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100">
              CHRONOVA Butik Manzili
            </h3>

            <div className="space-y-4 text-xs text-graphite-600 dark:text-ivory-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-graphite-900 dark:text-ivory-100">Showroom:</span>
                  <span>Toshkent shahri, Amir Temur shoh ko‘chasi, 108</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-graphite-900 dark:text-ivory-100">Konsyerj telefoni:</span>
                  <a href="tel:+998712009090" className="hover:text-gold-500 font-mono text-sm font-bold">
                    +998 71 200 90 90
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-graphite-900 dark:text-ivory-100">Elektron pochta:</span>
                  <a href="mailto:concierge@chronova.uz" className="hover:text-gold-500 font-mono">
                    concierge@chronova.uz
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-graphite-900 dark:text-ivory-100">Ish vaqti:</span>
                  <span>Har kuni 10:00 dan 21:00 gacha (dam olish kunlarisiz)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white dark:bg-surface-darkCard p-8 rounded-3xl border border-gold-500/20 shadow-luxury">
          <h3 className="font-serif text-xl font-bold text-graphite-900 dark:text-ivory-100 mb-2">
            Konsyerjga Xabar Qoldirish
          </h3>
          <p className="text-xs text-graphite-500 dark:text-ivory-400 mb-6">
            Biz sizga 15 daqiqa ichida javob qaytaramiz.
          </p>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <h4 className="font-serif text-lg font-bold text-green-800 dark:text-green-300">
                Xabaringiz Qabul Qilindi!
              </h4>
              <p className="text-xs text-green-700 dark:text-green-400">
                Konsyerj mutaxassisimiz ko‘rsatilgan telefon raqami orqali tez orada bog‘lanadi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                    Ismingiz *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Sardor"
                    className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                    Telefon raqamingiz *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                  Xabar yoki qiziqtirgan soat modeli *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Qaysi brend, model yoki xizmat turi bo‘yicha konsultatsiya kerak?"
                  className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Xabarni Yuborish</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
