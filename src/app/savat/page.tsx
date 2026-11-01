'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatUzs } from '@/lib/utils/format';
import { useI18n } from '@/context/I18nContext';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotalUzs,
    appliedCoupon,
    discountUzs,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { t } = useI18n();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    const res = await applyCoupon(couponInput);
    setCouponLoading(false);

    if (!res.success) {
      setCouponError(res.message || 'Yaroqsiz kupon');
    } else {
      setCouponInput('');
    }
  };

  const deliveryFee = 0; // Free luxury insured delivery
  const finalTotal = subtotalUzs - discountUzs + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-graphite-500 dark:text-ivory-400 mb-6">
        <Link href="/" className="hover:text-gold-500 transition-colors">Bosh sahifa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-graphite-900 dark:text-ivory-100 font-medium">Xarid Savati</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-graphite-900 dark:text-ivory-100">
          Xarid Savati
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-1">
          Savatingizda {items.length} ta mahsulot mavjud.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-darkCard rounded-3xl p-8 border border-graphite-200 dark:border-graphite-800">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-graphite-900 dark:text-ivory-100 mb-2">
            Savatingiz bo‘sh
          </h2>
          <p className="text-xs sm:text-sm text-graphite-500 dark:text-ivory-400 max-w-md mx-auto mb-6">
            Katalogimizdagi eng sara Shveytsariya durdonalarini ko‘rib chiqing va o‘zingizga yoqqan soatni tanlang.
          </p>
          <Link
            href="/katalog"
            className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-block"
          >
            Katalogni ko‘rish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const img = item.product.images?.[0]?.image_url || '/images/watches/rolex-submariner.jpg';
              return (
                <div
                  key={`${item.product.id}-${item.variant?.id || 'base'}`}
                  className="p-5 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-graphite-900 flex-shrink-0">
                      <Image src={img} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-gold-600 dark:text-gold-400 font-bold block">
                        {item.product.brand?.name || 'Swiss Watch'}
                      </span>
                      <Link
                        href={`/mahsulot/${item.product.slug}`}
                        className="font-serif text-base font-semibold text-graphite-900 dark:text-ivory-100 hover:text-gold-500 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-graphite-400 font-mono block mt-0.5">
                        SKU: {item.product.sku}
                      </span>
                      <span className="text-xs font-bold text-graphite-900 dark:text-ivory-100 font-mono block mt-1 sm:hidden">
                        {formatUzs(item.selectedPriceUzs)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-graphite-100 dark:border-graphite-800">
                    {/* Quantity Modifier */}
                    <div className="flex items-center border border-graphite-300 dark:border-graphite-700 rounded-xl overflow-hidden bg-ivory-50 dark:bg-surface-dark">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                        className="px-3 py-1.5 hover:bg-gold-500/10 text-graphite-600 dark:text-ivory-300 text-xs font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold font-mono text-graphite-900 dark:text-ivory-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                        className="px-3 py-1.5 hover:bg-gold-500/10 text-graphite-600 dark:text-ivory-300 text-xs font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <span className="text-sm font-bold font-mono text-graphite-900 dark:text-ivory-100 block">
                        {formatUzs(item.selectedPriceUzs * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-graphite-400 font-mono">
                          {formatUzs(item.selectedPriceUzs)} / dona
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id, item.variant?.id)}
                      className="p-2 text-graphite-400 hover:text-red-500 transition-colors"
                      aria-label="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-gold-500/20 space-y-4">
              <h3 className="font-serif text-lg font-bold text-graphite-900 dark:text-ivory-100">
                Buyurtma Hisobi
              </h3>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-700 dark:text-green-300">
                  <span>Kupon qo‘llandi: <b>{appliedCoupon}</b> (-{formatUzs(discountUzs)})</span>
                  <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">
                    Bekor qilish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promokod (masalan: CHRONOVA10)"
                    className="flex-1 bg-ivory-100 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-3 py-2 text-xs uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 bg-graphite-900 dark:bg-graphite-800 text-ivory-100 rounded-xl text-xs font-semibold hover:bg-gold-500 hover:text-white transition-colors"
                  >
                    Qo‘llash
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}

              {/* Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-graphite-200 dark:border-graphite-800">
                <div className="flex justify-between text-graphite-600 dark:text-ivory-400">
                  <span>Oraliq summa</span>
                  <span className="font-mono">{formatUzs(subtotalUzs)}</span>
                </div>
                {discountUzs > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Chegirma</span>
                    <span className="font-mono">-{formatUzs(discountUzs)}</span>
                  </div>
                )}
                <div className="flex justify-between text-graphite-600 dark:text-ivory-400">
                  <span>Sug‘urtalangan yetkazish</span>
                  <span className="text-gold-600 dark:text-gold-400 font-medium">Bepul</span>
                </div>
                <div className="flex justify-between text-base font-bold text-graphite-900 dark:text-ivory-100 pt-3 border-t border-graphite-200 dark:border-graphite-800">
                  <span>Jami to‘lov</span>
                  <span className="text-gold-600 dark:text-gold-400 font-mono">{formatUzs(finalTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-luxury transition-all"
              >
                <span>Rasmiylashtirishga O‘tish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-graphite-500 dark:text-ivory-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>Qabul qilib olganda to‘lov va rasmiy kafolat</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
