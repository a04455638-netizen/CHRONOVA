'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Lock,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { UZBEKISTAN_REGIONS, formatUzs, validateUzbekPhone } from '@/lib/utils/format';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalUzs, appliedCoupon, discountUzs, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState<string>(UZBEKISTAN_REGIONS[0]);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'card_upon_receipt'>('cash_on_delivery');
  const [termsAgreed, setTermsAgreed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deliveryFee = deliveryType === 'express' ? 50000 : 0;
  const finalTotal = subtotalUzs - discountUzs + deliveryFee;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Xarid savatingiz bo‘sh.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Iltimos, to‘liq ismingizni kiriting.');
      return;
    }

    if (!validateUzbekPhone(phone)) {
      setErrorMessage('Iltimos, to‘g‘ri O‘zbekiston telefon raqamini kiriting (+998 90 123 45 67).');
      return;
    }

    if (!city.trim() || !address.trim()) {
      setErrorMessage('Iltimos, shahar / tuman va aniq ko‘cha manzilini to‘liq kiriting.');
      return;
    }

    if (!termsAgreed) {
      setErrorMessage('Iltimos, butik xizmat ko‘rsatish shartlariga rozilik bildiring.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customer_name: fullName,
        customer_phone: phone,
        customer_email: email || undefined,
        delivery_region: region,
        delivery_city: city,
        delivery_address: address,
        delivery_notes: notes || undefined,
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon || undefined,
        items: items.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant?.id,
          quantity: item.quantity,
        })),
        idempotency_key: `chk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Buyurtma rasmiylashtirishda xatolik yuz berdi.');
      }

      // Clear cart on success
      clearCart();

      // Navigate to confirmation page
      router.push(`/buyurtma-tasdiqlandi?orderId=${data.order.id}&orderNumber=${data.order_number}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-graphite-900 dark:text-ivory-100 mb-4">
          Xarid Savatingiz Bo‘sh
        </h1>
        <p className="text-xs sm:text-sm text-graphite-500 mb-6">
          Buyurtma rasmiylashtirish uchun avval katalogdan soat tanlang.
        </p>
        <Link
          href="/katalog"
          className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider inline-block"
        >
          Katalogni Ko‘rish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-graphite-500 dark:text-ivory-400 mb-6">
        <Link href="/" className="hover:text-gold-500">Bosh sahifa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/savat" className="hover:text-gold-500">Savat</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-graphite-900 dark:text-ivory-100 font-medium">Buyurtma Rasmiylashtirish</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-graphite-900 dark:text-ivory-100">
          Buyurtmani Rasmiylashtirish
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-1">
          Ma’lumotlaringizni kiriting va buyurtmani tasdiqlang.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Customer and Delivery Info */}
          <div className="lg:col-span-7 space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Customer Details */}
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 space-y-4">
              <h2 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100 flex items-center gap-2">
                <span>1. Mijoz Ma’lumotlari</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                    To‘liq ism-familiyangiz *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Aziz Rahimov"
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
                    onChange={handlePhoneChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                  Elektron pochta (ixtiyoriy — chek va xabarnomalar uchun)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aziz.rahimov@example.uz"
                  className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 space-y-4">
              <h2 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100 flex items-center gap-2">
                <span>2. Yetkazib Berish Manzili</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                    Viloyat / Shahar *
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-500"
                  >
                    {UZBEKISTAN_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                    Tuman yoki Shahar nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Masalan: Mirzo Ulug‘bek tumani"
                    className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                  Aniq ko‘cha, uy va xonadon *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masalan: Buyuk Ipak Yo‘li ko‘chasi, 45-uy, 12-xonadon"
                  className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="text-xs">
                <label className="block text-graphite-700 dark:text-ivory-300 font-semibold mb-1">
                  Kuryer uchun maxsus izoh (ixtiyoriy)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Domofon kodi, etaj yoki qulay vaqt..."
                  className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Delivery Speed Options */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  onClick={() => setDeliveryType('standard')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                    deliveryType === 'standard'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-graphite-300 dark:border-graphite-700 hover:border-gold-500/50'
                  }`}
                >
                  <Truck className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-graphite-900 dark:text-ivory-100 block">Standart Yetkazish</span>
                    <span className="text-[11px] text-graphite-500 dark:text-ivory-400 block">24 soat ichida • Bepul</span>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryType('express')}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                    deliveryType === 'express'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-graphite-300 dark:border-graphite-700 hover:border-gold-500/50'
                  }`}
                >
                  <Clock className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-graphite-900 dark:text-ivory-100 block">Ekspress VIP</span>
                    <span className="text-[11px] text-graphite-500 dark:text-ivory-400 block">3 soat ichida • +50 000 so‘m</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 space-y-4">
              <h2 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100 flex items-center gap-2">
                <span>3. Xavfsiz To‘lov Usuli</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-graphite-300 dark:border-graphite-700 hover:border-gold-500/50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-graphite-900 dark:text-ivory-100 block">Qabul qilganda Naqd</span>
                    <span className="text-[11px] text-graphite-500 dark:text-ivory-400 block">Soatni ko‘rib, kuryerga to‘lash</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('card_upon_receipt')}
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                    paymentMethod === 'card_upon_receipt'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-graphite-300 dark:border-graphite-700 hover:border-gold-500/50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-graphite-900 dark:text-ivory-100 block">Karta Orqali (Terminal)</span>
                    <span className="text-[11px] text-graphite-500 dark:text-ivory-400 block">Uzcard, Humo, Visa yoki Mastercard</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-graphite-600 dark:text-ivory-400">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-graphite-400 text-gold-500 focus:ring-gold-500"
                />
                <span>
                  CHRONOVA butikining xarid va yetkazib berish <Link href="/kafolat-va-yetkazish" target="_blank" className="text-gold-500 underline">siyosatiga</Link> roziman.
                </span>
              </label>
            </div>
          </div>

          {/* Right Column: Order Summary Snapshot */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-gold-500/30 shadow-luxury space-y-6 sticky top-28">
              <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100 pb-3 border-b border-graphite-200 dark:border-graphite-800">
                Buyurtma Tafsilotlari ({items.length})
              </h3>

              {/* Items Snapshot */}
              <div className="max-h-60 overflow-y-auto divide-y divide-graphite-100 dark:divide-graphite-800 pr-1 space-y-3">
                {items.map((item) => {
                  const img = item.product.images?.[0]?.image_url || '/images/watches/rolex-submariner.jpg';
                  return (
                    <div key={item.product.id} className="pt-3 flex gap-3 items-center">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-graphite-900 flex-shrink-0">
                        <Image src={img} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-xs">
                        <span className="font-semibold text-graphite-900 dark:text-ivory-100 line-clamp-1">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-graphite-400 font-mono block">
                          {item.quantity} dona × {formatUzs(item.selectedPriceUzs)}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-mono text-graphite-900 dark:text-ivory-100">
                        {formatUzs(item.selectedPriceUzs * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-2 text-xs pt-4 border-t border-graphite-200 dark:border-graphite-800">
                <div className="flex justify-between text-graphite-600 dark:text-ivory-400">
                  <span>Oraliq summa</span>
                  <span className="font-mono">{formatUzs(subtotalUzs)}</span>
                </div>
                {discountUzs > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Chegirma ({appliedCoupon})</span>
                    <span className="font-mono">-{formatUzs(discountUzs)}</span>
                  </div>
                )}
                <div className="flex justify-between text-graphite-600 dark:text-ivory-400">
                  <span>Yetkazib berish ({deliveryType === 'express' ? 'Ekspress VIP' : 'Standart'})</span>
                  <span className="font-mono">
                    {deliveryFee > 0 ? formatUzs(deliveryFee) : 'Bepul'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-graphite-900 dark:text-ivory-100 pt-3 border-t border-graphite-200 dark:border-graphite-800">
                  <span>Jami to‘lov</span>
                  <span className="text-gold-600 dark:text-gold-400 font-mono">{formatUzs(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-luxury hover:shadow-luxury-hover transition-all"
              >
                {loading ? (
                  <span>Buyurtma tasdiqlanmoqda...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Buyurtmani Tasdiqlash</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-graphite-500 dark:text-ivory-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>To‘lov faqat mahsulotni to‘liq ko‘rikdan o‘tkazgach amalga oshiriladi</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
