import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  CreditCard,
  Truck,
  Sparkles,
  PieChart,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { formatUzs } from '@/lib/utils/format';

export const metadata = {
  title: 'Chuqur Analitika — CHRONOVA Admin',
};

export default async function AdminAnalyticsPage() {
  const stats = await DataStore.getAdminStats();
  const brands = await DataStore.getAllBrandsAdmin();
  const allOrders = await DataStore.getOrders();

  // 1. Revenue by Brand
  const brandSales = brands.map((b) => {
    let revenue = 0;
    let units = 0;

    for (const ord of allOrders) {
      if (ord.status !== 'cancelled') {
        for (const item of ord.items) {
          if (
            item.product_name_snapshot.toLowerCase().includes(b.name.toLowerCase()) ||
            item.sku_snapshot.toLowerCase().startsWith(b.name.toLowerCase().slice(0, 3))
          ) {
            revenue += item.total_price_uzs;
            units += item.quantity;
          }
        }
      }
    }

    return {
      brand: b.name,
      origin: b.origin_country,
      revenue,
      units,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const totalBrandRevenue = brandSales.reduce((s, b) => s + b.revenue, 0) || stats.totalRevenue || 1;

  // 2. Regional Sales Distribution
  const regionMap = new Map<string, { count: number; total: number }>();
  for (const ord of allOrders) {
    if (ord.status !== 'cancelled') {
      const reg = ord.delivery_region || 'Toshkent shahri';
      const prev = regionMap.get(reg) || { count: 0, total: 0 };
      regionMap.set(reg, {
        count: prev.count + 1,
        total: prev.total + ord.total_uzs,
      });
    }
  }

  const regionSales = Array.from(regionMap.entries())
    .map(([region, data]) => ({
      region,
      orders: data.count,
      total: data.total,
      percent: Math.round((data.total / Math.max(stats.totalRevenue, 1)) * 100),
    }))
    .sort((a, b) => b.total - a.total);

  // 3. Payment Method breakdown
  const cashCount = allOrders.filter((o) => o.payment_method === 'cash_on_delivery').length;
  const cardCount = allOrders.filter((o) => o.payment_method === 'card_upon_receipt').length;
  const cashPercent = allOrders.length > 0 ? Math.round((cashCount / allOrders.length) * 100) : 50;
  const cardPercent = 100 - cashPercent;

  // 4. Delivery Type breakdown
  const expressCount = allOrders.filter((o) => o.delivery_type === 'express').length;
  const standardCount = allOrders.length - expressCount;
  const expressPercent = allOrders.length > 0 ? Math.round((expressCount / allOrders.length) * 100) : 30;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
            Biznes Razvedka
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
            <BarChart3 className="w-7 h-7 text-[#D4AF37]" />
            <span>Savdo va Segmentlar Analitikasi</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real Vaqtdagi Hisobot</span>
        </div>
      </div>

      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Jami Real Tushum</span>
          <span className="font-mono text-xl font-bold text-[#D4AF37] mt-1 block">
            {formatUzs(stats.totalRevenue)}
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Tasdiqlangan buyurtmalar</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">O‘rtacha Savdo Cheki (AOV)</span>
          <span className="font-mono text-xl font-bold text-white mt-1 block">
            {formatUzs(Math.round(stats.totalRevenue / Math.max(stats.totalOrders, 1)))}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Har bir tranzaksiyaga</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">To‘lov Usuli (Naqd / Karta)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-sm font-bold text-white">Naqd: {cashPercent}%</span>
            <span className="font-mono text-sm font-bold text-[#D4AF37]">Karta: {cardPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.08] mt-2 overflow-hidden flex">
            <div style={{ width: `${cashPercent}%` }} className="bg-white/60" />
            <div style={{ width: `${cardPercent}%` }} className="bg-[#D4AF37]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">VIP Ekspress Yetkazish</span>
          <span className="font-mono text-xl font-bold text-purple-400 mt-1 block">
            {expressPercent}% ulush
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">24 soatlik inkassator xizmati</span>
        </div>
      </div>

      {/* Main Grid: Brand Performance + Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Brand Sales Distribution */}
        <div className="lg:col-span-7 bg-[#141414] p-6 rounded-3xl border border-white/[0.08] space-y-6 shadow-xl">
          <div className="pb-4 border-b border-white/[0.08] flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                Brendlar Nufuzi
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                Brendlar Bo‘yicha Savdo Hajmi
              </h2>
            </div>
            <Award className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <div className="space-y-4">
            {brandSales.map((b) => {
              const sharePercent = totalBrandRevenue > 0 ? Math.round((b.revenue / totalBrandRevenue) * 100) : 0;
              return (
                <div key={b.brand} className="space-y-1.5 group">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {b.brand}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">
                        ({b.origin})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">
                        {formatUzs(b.revenue)}
                      </span>
                      <span className="text-[10px] text-[#D4AF37] font-mono ml-2">
                        {sharePercent}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-black/50 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(5, sharePercent)}%` }}
                      className="h-full bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37] rounded-full group-hover:brightness-125 transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="lg:col-span-5 bg-[#141414] p-6 rounded-3xl border border-white/[0.08] space-y-6 shadow-xl">
          <div className="pb-4 border-b border-white/[0.08] flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                Geografik Xarita
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                Hududlar Bo‘yicha Taqsimot
              </h2>
            </div>
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <div className="space-y-3">
            {regionSales.map((r, idx) => (
              <div
                key={r.region}
                className="p-3 rounded-2xl bg-black/40 border border-white/[0.05] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-serif font-bold text-[#D4AF37] w-4 text-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-white block">{r.region}</span>
                    <span className="text-[10px] text-gray-400 block">{r.orders} ta buyurtma</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white block">
                    {formatUzs(r.total)}
                  </span>
                  <span className="text-[10px] text-[#D4AF37] font-mono block">
                    {r.percent}% ulush
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-xs text-gray-400">
            <span className="font-semibold text-white block">Toshkent va Viloyatlarga Yetkazish</span>
            <span className="text-[11px] block mt-0.5">
              Toshkent shahriga 24 soatda maxsus inkassator kuryer, viloyatlar markazlariga 48 soatda yetkaziladi.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
