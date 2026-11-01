'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Crown,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  TrendingUp,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import type { CustomerSummary, Order } from '@/types';
import { formatUzs, formatDateTime } from '@/lib/utils/format';

interface CustomersClientProps {
  initialCustomers: CustomerSummary[];
  allOrders: Order[];
}

export default function CustomersClient({
  initialCustomers,
  allOrders,
}: CustomersClientProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'vip' | 'regular' | 'new'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  // Compute metrics
  const totalCustomers = initialCustomers.length;
  const vipCount = initialCustomers.filter((c) => c.status === 'vip').length;
  const repeatCount = initialCustomers.filter((c) => c.ordersCount > 1).length;
  const totalSpentAll = initialCustomers.reduce((sum, c) => sum + c.totalSpentUzs, 0);
  const avgClv = totalCustomers > 0 ? Math.round(totalSpentAll / totalCustomers) : 0;

  // Filter customers
  const filtered = initialCustomers.filter((c) => {
    const matchesSearch =
      search.trim() === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      c.region.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get orders for selected customer drawer
  const customerOrders = selectedCustomer
    ? allOrders.filter(
        (o) =>
          o.customer_phone.replace(/\D/g, '') ===
          selectedCustomer.phone.replace(/\D/g, '')
      )
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
            Mijozlar Portfeli
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
            <Users className="w-7 h-7 text-[#D4AF37]" />
            <span>Mijozlar Boshqaruvi</span>
          </h1>
        </div>

        <div className="text-xs text-gray-400">
          Jami faol mijozlar: <strong className="text-white font-mono">{totalCustomers} nafar</strong>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium block">
              Jami Xaridorlar
            </span>
            <span className="font-mono text-2xl font-bold text-white mt-1 block">
              {totalCustomers} <span className="text-xs font-normal text-gray-400">mijoz</span>
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* VIP Customers */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium block">
              VIP Shaxsiy Xaridorlar
            </span>
            <span className="font-mono text-2xl font-bold text-[#D4AF37] mt-1 block">
              {vipCount} <span className="text-xs font-normal text-gray-400">mijoz</span>
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        {/* Repeat Buyers */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium block">
              Takroriy Xaridorlar
            </span>
            <span className="font-mono text-2xl font-bold text-blue-400 mt-1 block">
              {repeatCount} <span className="text-xs font-normal text-gray-400">mijoz</span>
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Average CLV */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium block">
              O‘rtacha Xarid (CLV)
            </span>
            <span className="font-mono text-lg font-bold text-white mt-1 block truncate" title={formatUzs(avgClv)}>
              {formatUzs(avgClv)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mijoz ismi, telefon yoki manzil bo‘yicha..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141414] border border-white/[0.08] self-stretch sm:self-auto overflow-x-auto">
          {(['all', 'vip', 'regular', 'new'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st === 'all'
                ? 'Barchasi'
                : st === 'vip'
                ? 'VIP Mijozlar'
                : st === 'regular'
                ? 'Doimiy'
                : 'Yangi'}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#141414] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            Mijozlar topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-black/50 text-gray-400 border-b border-white/[0.08]">
                  <th className="py-3.5 px-4 font-semibold">Mijoz</th>
                  <th className="py-3.5 px-4 font-semibold">Kontakt Ma’lumotlari</th>
                  <th className="py-3.5 px-4 font-semibold">Manzil</th>
                  <th className="py-3.5 px-4 font-semibold">Buyurtmalar</th>
                  <th className="py-3.5 px-4 font-semibold">Jami Xarid</th>
                  <th className="py-3.5 px-4 font-semibold">Oxirgi Buyurtma</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xs font-bold font-serif">
                          {c.name[0]}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{c.name}</span>
                          {c.status === 'vip' && (
                            <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider mt-0.5">
                              <Crown className="w-2.5 h-2.5" />
                              <span>VIP Xaridor</span>
                            </span>
                          )}
                          {c.status === 'regular' && (
                            <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wider mt-0.5">
                              Doimiy
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-gray-300">
                      <a
                        href={`tel:${c.phone}`}
                        className="hover:text-[#D4AF37] font-mono flex items-center gap-1.5 block"
                      >
                        <Phone className="w-3 h-3 text-gray-500" />
                        <span>{c.phone}</span>
                      </a>
                      {c.email && (
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                          {c.email}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-gray-300 max-w-[200px]">
                      <span className="font-medium text-white block">{c.region}</span>
                      <span className="text-[11px] text-gray-400 block truncate" title={c.address}>
                        {c.city}, {c.address}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-white">
                      {c.ordersCount} ta
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-[#D4AF37]">
                      {formatUzs(c.totalSpentUzs)}
                    </td>

                    <td className="py-4 px-4 text-gray-400 text-[11px]">
                      {formatDateTime(c.lastOrderDate)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-colors"
                      >
                        Tarixni Ko‘rish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#141414] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-lg font-bold font-serif">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {selectedCustomer.name}
                  </h3>
                  <span className="text-xs text-[#D4AF37] font-mono">
                    {selectedCustomer.phone}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] uppercase text-gray-500 block">Jami Xarid</span>
                <span className="font-mono text-sm font-bold text-[#D4AF37] mt-0.5 block">
                  {formatUzs(selectedCustomer.totalSpentUzs)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] uppercase text-gray-500 block">Buyurtmalar</span>
                <span className="font-mono text-sm font-bold text-white mt-0.5 block">
                  {selectedCustomer.ordersCount} ta
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] uppercase text-gray-500 block">Status</span>
                <span className="text-xs font-bold text-white uppercase mt-1 block">
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-xs space-y-1">
              <span className="text-gray-400 font-semibold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Yetkazib berish manzili:</span>
              </span>
              <span className="text-white block font-medium">
                {selectedCustomer.region}, {selectedCustomer.city}, {selectedCustomer.address}
              </span>
            </div>

            {/* Orders History */}
            <div className="space-y-3">
              <h4 className="font-serif text-base font-bold text-white">
                Mijozning Barcha Buyurtmalari ({customerOrders.length})
              </h4>
              <div className="space-y-2">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#D4AF37] block">
                        {ord.order_number}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {formatDateTime(ord.created_at)} • {ord.items.length} ta soat
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-white block">
                        {formatUzs(ord.total_uzs)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
