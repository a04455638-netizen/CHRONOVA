'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Filter, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatUzs, formatDateTime } from '@/lib/utils/format';

interface AdminOrdersClientProps {
  initialOrders: Order[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.delivery_region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
            Savdo Boshqaruvi
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Mijozlar Buyurtmalari ({orders.length})
          </h1>
        </div>

        {/* Quick status tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#141414] border border-white/[0.08] text-xs">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'Barchasi' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#141414] p-4 rounded-2xl border border-white/[0.08]">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buyurtma raqami, mijoz ismi yoki telefon bo‘yicha qidirish..."
            className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141414] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-black/50 text-gray-400 border-b border-white/[0.08]">
                <th className="p-4">Raqam & Sana</th>
                <th className="p-4">Mijoz & Aloqa</th>
                <th className="p-4">Manzil</th>
                <th className="p-4">Mahsulotlar</th>
                <th className="p-4">Jami Summa</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-800">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-graphite-900/40 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-gold-400 block">{ord.order_number}</span>
                    <span className="text-[10px] text-graphite-400">{formatDateTime(ord.created_at)}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-ivory-100 block">{ord.customer_name}</span>
                    <span className="text-[11px] text-graphite-400 font-mono">{ord.customer_phone}</span>
                  </td>
                  <td className="p-4 text-graphite-300">
                    <span className="font-semibold block">{ord.delivery_region}</span>
                    <span className="text-[10px] text-graphite-400">{ord.delivery_city}</span>
                  </td>
                  <td className="p-4 text-graphite-300">
                    {ord.items.map((it, i) => (
                      <span key={i} className="block line-clamp-1">
                        • {it.product_name_snapshot} ({it.quantity} dona)
                      </span>
                    ))}
                  </td>
                  <td className="p-4 font-mono font-bold text-ivory-100">
                    {formatUzs(ord.total_uzs)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : ord.status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : ord.status === 'processing'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : ord.status === 'shipped'
                          ? 'bg-purple-500/20 text-purple-400'
                          : ord.status === 'delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/buyurtmalar/${ord.id}`}
                      className="px-3 py-1.5 rounded-xl bg-graphite-800 hover:bg-gold-500 text-ivory-100 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Batafsil</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
