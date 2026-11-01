'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Printer,
  ShieldCheck,
  Send,
  User,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatUzs, formatDateTime } from '@/lib/utils/format';

interface OrderDetailClientProps {
  initialOrder: Order;
}

export default function OrderDetailClient({ initialOrder }: OrderDetailClientProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [newStatus, setNewStatus] = useState<OrderStatus>(initialOrder.status);
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: newStatus,
          comment: comment || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Statusni yangilashda xatolik yuz berdi');
      }

      setOrder(data.order);
      setSuccessMsg(`Status muvaffaqiyatli o‘zgardi: ${newStatus}`);
      setComment('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/buyurtmalar"
            className="p-2.5 rounded-xl bg-black/50 hover:bg-[#D4AF37] hover:text-black text-white border border-white/[0.1] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
              Buyurtma Tafsilotlari
            </span>
            <h1 className="font-serif text-2xl font-bold text-white font-mono mt-0.5">
              {order.order_number}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-white/[0.1] hover:border-[#D4AF37] text-xs font-semibold text-gray-200 flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Chekni Chop Etish</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Details & Status Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer & Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Delivery Card */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] space-y-4 text-xs shadow-xl">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>Mijoz va Yetkazish Ma’lumotlari</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-graphite-300">
              <div>
                <span className="text-graphite-500 block mb-0.5">Mijoz Ismi:</span>
                <span className="font-semibold text-ivory-100 text-sm">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-graphite-500 block mb-0.5">Telefon Raqami:</span>
                <a href={`tel:${order.customer_phone}`} className="font-mono font-semibold text-gold-400 hover:underline">
                  {order.customer_phone}
                </a>
              </div>
              <div>
                <span className="text-graphite-500 block mb-0.5">Viloyat / Shahar:</span>
                <span className="font-semibold text-ivory-100">{order.delivery_region}, {order.delivery_city}</span>
              </div>
              <div>
                <span className="text-graphite-500 block mb-0.5">To‘lov Usuli:</span>
                <span className="font-semibold text-ivory-100">
                  {order.payment_method === 'cash_on_delivery' ? 'Qabul qilganda naqd' : 'Karta orqali'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-graphite-800 text-graphite-300">
              <span className="text-graphite-500 block mb-0.5">Aniq Manzil:</span>
              <span className="font-medium text-ivory-100">{order.delivery_address}</span>
            </div>

            {order.delivery_notes && (
              <div className="p-3 rounded-xl bg-graphite-900 border border-graphite-800 text-graphite-300">
                <span className="text-gold-400 font-semibold block mb-0.5">Kuryer uchun izoh:</span>
                <span>{order.delivery_notes}</span>
              </div>
            )}
          </div>

          {/* Ordered Watch Items Snapshot */}
          <div className="p-6 rounded-3xl bg-surface-darkCard border border-graphite-800 space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-ivory-100">
              Buyurtma Qilingan Soatlar Snapshot
            </h3>

            <div className="divide-y divide-graphite-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-ivory-100 block text-sm">{item.product_name_snapshot}</span>
                    <span className="text-graphite-400 font-mono">
                      SKU: {item.sku_snapshot} | {item.quantity} dona × {formatUzs(item.unit_price_uzs)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-ivory-100 text-sm">
                    {formatUzs(item.total_price_uzs)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-graphite-800 space-y-1.5 text-graphite-300">
              <div className="flex justify-between">
                <span>Oraliq summa:</span>
                <span className="font-mono">{formatUzs(order.subtotal_uzs)}</span>
              </div>
              {order.discount_uzs > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Chegirma:</span>
                  <span className="font-mono">-{formatUzs(order.discount_uzs)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Yetkazish to‘lovi:</span>
                <span className="font-mono">{formatUzs(order.delivery_fee_uzs)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gold-400 pt-2 border-t border-graphite-800">
                <span>Jami To‘lov:</span>
                <span className="font-mono">{formatUzs(order.total_uzs)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Transition FSM */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-surface-darkCard border border-gold-500/30 shadow-luxury space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-ivory-100">
              Statusni Yangilash (FSM)
            </h3>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-graphite-300 font-semibold mb-1">
                  Yangi Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3.5 py-2.5 text-xs text-ivory-100 focus:outline-none focus:border-gold-500 uppercase font-semibold"
                >
                  <option value="pending">Pending (Kutilmoqda)</option>
                  <option value="confirmed">Confirmed (Tasdiqlandi)</option>
                  <option value="processing">Processing (Omborda tekshirilmoqda)</option>
                  <option value="shipped">Shipped (Kuryerga topshirildi)</option>
                  <option value="delivered">Delivered (Mijozga yetkazildi)</option>
                  <option value="cancelled">Cancelled (Bekor qilindi)</option>
                </select>
              </div>

              <div>
                <label className="block text-graphite-300 font-semibold mb-1">
                  Menejer Izohi (Tarixga yoziladi)
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Masalan: Kuryer Rustamga topshirildi (Tel: +998 90...)"
                  className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-xs text-ivory-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow"
              >
                {updating ? 'Saqlanmoqda...' : 'Statusni Tasdiqlash'}
              </button>
            </form>
          </div>

          {/* Status Timeline History */}
          <div className="p-6 rounded-3xl bg-surface-darkCard border border-graphite-800 space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-ivory-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>Status O‘zgarishlari Tarixi</span>
            </h4>

            <div className="space-y-3 pt-2">
              {order.status_history?.map((hist, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-graphite-900 border border-graphite-800/80 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-graphite-400 font-mono">
                    <span className="uppercase font-bold text-gold-400">{hist.new_status}</span>
                    <span>{formatDateTime(hist.created_at)}</span>
                  </div>
                  <p className="text-graphite-300 text-xs">{hist.comment || 'Status yangilandi'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
