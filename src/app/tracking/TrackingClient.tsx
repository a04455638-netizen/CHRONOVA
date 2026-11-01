'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatUzs, formatDateTime } from '@/lib/utils/format';
import { useI18n } from '@/context/I18nContext';

interface TrackingClientProps {
  initialOrderNumber?: string;
}

export default function TrackingClient({ initialOrderNumber = '' }: TrackingClientProps) {
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const queryId = searchParams.get('id') || initialOrderNumber;
  const queryPhone = searchParams.get('phone') || '';

  const [orderIdInput, setOrderIdInput] = useState(queryId);
  const [phoneInput, setPhoneInput] = useState(queryPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (id: string, ph: string) => {
    if (!id.trim()) {
      setError(t('track_order_number_label'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(id.trim())}&phone=${encodeURIComponent(ph.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.order) {
        throw new Error(data.error || t('track_not_found_desc'));
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || t('track_not_found_desc'));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      fetchTracking(queryId, queryPhone);
    }
  }, [queryId, queryPhone]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderIdInput, phoneInput);
  };

  const getStatusLabel = (key: OrderStatus) => {
    switch (key) {
      case 'pending': return t('status_pending');
      case 'confirmed': return t('status_confirmed');
      case 'processing': return t('status_processing');
      case 'shipped': return t('status_shipped');
      case 'delivered': return t('status_delivered');
      case 'cancelled': return t('status_cancelled');
      default: return key;
    }
  };

  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: getStatusLabel('pending') },
    { key: 'confirmed', label: getStatusLabel('confirmed') },
    { key: 'processing', label: getStatusLabel('processing') },
    { key: 'shipped', label: getStatusLabel('shipped') },
    { key: 'delivered', label: getStatusLabel('delivered') },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-gold-600 dark:text-gold-400 font-semibold block mb-1">
          CHRONOVA Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-graphite-900 dark:text-ivory-100">
          {t('track_title')}
        </h1>
        <p className="text-xs sm:text-sm text-graphite-600 dark:text-ivory-300 mt-2 max-w-md mx-auto">
          {t('track_subtitle')}
        </p>
      </div>

      {/* Lookup Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-surface-darkCard border border-gold-500/30 shadow-luxury mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-graphite-700 dark:text-ivory-300 mb-1">
              {t('track_order_number_label')}
            </label>
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder={t('track_order_number_ph')}
              className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-4 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-graphite-700 dark:text-ivory-300 mb-1">
              {t('track_phone_label')}
            </label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full bg-ivory-50 dark:bg-surface-dark border border-graphite-300 dark:border-graphite-700 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 active:scale-[0.99] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? t('track_btn_loading') : t('track_btn_search')}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Card & Timeline */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Status Timeline */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 shadow-luxury">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-graphite-100 dark:border-graphite-800 gap-2">
              <div>
                <span className="text-xs text-graphite-500">{t('confirm_order_number')}</span>
                <h3 className="font-mono text-lg font-bold text-gold-600 dark:text-gold-400">
                  {order.order_number}
                </h3>
              </div>
              <div className="text-xs text-graphite-500 font-mono">
                {formatDateTime(order.created_at)}
              </div>
            </div>

            {/* Stepper */}
            <div className="py-8">
              <div className="relative flex justify-between">
                {/* Connecting track */}
                <div className="absolute top-4 inset-x-6 h-0.5 bg-graphite-200 dark:bg-graphite-800 -z-0" />
                <div
                  className="absolute top-4 left-6 h-0.5 bg-gold-500 transition-all duration-500 -z-0"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 90}%` }}
                />

                {steps.map((st, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={st.key} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-gold-500 text-white shadow-md'
                            : 'bg-white dark:bg-surface-dark border-2 border-graphite-300 dark:border-graphite-700 text-graphite-400'
                        } ${isCurrent ? 'ring-4 ring-gold-500/20 scale-110' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-medium mt-2 text-center max-w-[80px] sm:max-w-none ${
                          isDone ? 'text-gold-600 dark:text-gold-400 font-bold' : 'text-graphite-400'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status History Log */}
            {order.status_history && order.status_history.length > 0 && (
              <div className="pt-4 border-t border-graphite-100 dark:border-graphite-800">
                <span className="text-xs uppercase tracking-wider font-semibold text-graphite-500 block mb-3">
                  {t('track_status_title')}
                </span>
                <div className="space-y-2">
                  {order.status_history.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-graphite-400 font-mono text-[11px] min-w-[130px]">
                        {formatDateTime(h.created_at)}:
                      </span>
                      <span className="text-graphite-800 dark:text-ivory-200 font-medium">
                        {h.comment || h.new_status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details & Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 space-y-3 text-xs">
              <h4 className="font-serif text-base font-bold text-graphite-900 dark:text-ivory-100">
                {t('track_delivery_info')}
              </h4>
              <div className="text-graphite-600 dark:text-ivory-300 space-y-1.5">
                <p><b>{t('track_customer_info')}:</b> {order.customer_name}</p>
                <p><b>{t('chk_phone_label')}:</b> {order.customer_phone}</p>
                <p><b>{t('chk_address_label')}:</b> {order.delivery_region}, {order.delivery_city}, {order.delivery_address}</p>
                <p><b>{t('payment_method_title')}:</b> {order.payment_method === 'cash_on_delivery' ? t('chk_pay_cash') : t('payment_card_receipt')}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-surface-darkCard border border-graphite-200 dark:border-graphite-800 space-y-3 text-xs">
              <h4 className="font-serif text-base font-bold text-graphite-900 dark:text-ivory-100">
                {t('track_items_title')}
              </h4>
              <div className="divide-y divide-graphite-100 dark:divide-graphite-800">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <div>
                      <span className="font-semibold block">{item.product_name_snapshot}</span>
                      <span className="text-[10px] text-graphite-400 font-mono">SKU: {item.sku_snapshot} × {item.quantity}</span>
                    </div>
                    <span className="font-mono font-bold">{formatUzs(item.total_price_uzs)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-graphite-200 dark:border-graphite-800 flex justify-between font-bold text-sm">
                <span>{t('cart_total')}:</span>
                <span className="text-gold-600 dark:text-gold-400 font-mono">{formatUzs(order.total_uzs)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
