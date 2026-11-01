'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatUzs } from '@/lib/utils/format';
import { useI18n } from '@/context/I18nContext';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
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

  if (!isOpen) return null;

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

  const deliveryFee = 0; // Free luxury delivery standard
  const finalTotal = subtotalUzs - discountUzs + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-surface-darkCard shadow-2xl flex flex-col border-l border-gold-500/20">
          {/* Header */}
          <div className="p-6 border-b border-graphite-200 dark:border-graphite-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-500" />
              <h2 className="font-serif text-lg font-bold tracking-wide text-graphite-900 dark:text-ivory-100">
                {t('cart_title')} ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-graphite-500 hover:text-graphite-900 dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-graphite-900 dark:text-ivory-100 mb-2">
                  {t('cart_empty')}
                </h3>
                <p className="text-xs text-graphite-500 dark:text-ivory-400 max-w-xs mb-6">
                  {t('cart_empty_desc')}
                </p>
                <Link
                  href="/katalog"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  {t('hero_cta')}
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const primaryImg = item.product.images?.[0]?.image_url || '/images/watches/rolex-submariner.jpg';
                return (
                  <div
                    key={`${item.product.id}-${item.variant?.id || 'base'}`}
                    className="flex gap-4 p-3 rounded-xl bg-ivory-100 dark:bg-surface-dark border border-graphite-200 dark:border-graphite-800"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-graphite-900">
                      <Image
                        src={primaryImg}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-graphite-900 dark:text-ivory-100 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            className="text-graphite-400 hover:text-red-500 transition-colors p-0.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[10px] text-gold-600 dark:text-gold-400 font-mono">
                          SKU: {item.product.sku}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-graphite-300 dark:border-graphite-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                            className="px-2 py-1 hover:bg-gold-500/10 text-graphite-600 dark:text-ivory-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-graphite-900 dark:text-ivory-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                            className="px-2 py-1 hover:bg-gold-500/10 text-graphite-600 dark:text-ivory-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-graphite-900 dark:text-ivory-100">
                          {formatUzs(item.selectedPriceUzs * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-graphite-200 dark:border-graphite-800 bg-ivory-50 dark:bg-surface-dark space-y-4">
              {/* Promo code */}
              {appliedCoupon ? (
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-700 dark:text-green-300">
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
                    placeholder={t('promo_code_placeholder')}
                    className="flex-1 bg-white dark:bg-surface-darkCard border border-graphite-300 dark:border-graphite-700 rounded-lg px-3 py-2 text-xs uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-3 py-2 bg-graphite-900 dark:bg-graphite-800 text-ivory-100 rounded-lg text-xs font-semibold hover:bg-gold-500 hover:text-white transition-colors"
                  >
                    {t('promo_apply')}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}

              {/* Price summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-graphite-600 dark:text-ivory-400">
                  <span>{t('cart_subtotal')}</span>
                  <span>{formatUzs(subtotalUzs)}</span>
                </div>
                {discountUzs > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>{t('cart_discount')}</span>
                    <span>-{formatUzs(discountUzs)}</span>
                  </div>
                )}
                <div className="flex justify-between text-graphite-600 dark:text-ivory-400">
                  <span>{t('cart_delivery')}</span>
                  <span className="text-gold-600 dark:text-gold-400 font-medium">{t('cart_delivery_free')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-graphite-900 dark:text-ivory-100 pt-2 border-t border-graphite-200 dark:border-graphite-800">
                  <span>{t('cart_total')}</span>
                  <span className="text-gold-600 dark:text-gold-400">{formatUzs(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 text-white rounded-xl font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-luxury transition-all"
              >
                <span>{t('cart_checkout_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-graphite-500 dark:text-ivory-400">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>100% Asl Shveytsariya kafolati & xavfsiz to‘lov</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
