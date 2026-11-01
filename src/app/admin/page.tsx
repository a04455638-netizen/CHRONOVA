import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  ShoppingBag,
  Watch,
  Users,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Send,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  BarChart3,
  Boxes,
  ExternalLink,
} from 'lucide-react';
import { DataStore } from '@/lib/data/store';
import { formatUzs, formatDateTime } from '@/lib/utils/format';

export const metadata = {
  title: 'Executive Dashboard — CHRONOVA Admin',
};

export default async function AdminDashboardPage() {
  const stats = await DataStore.getAdminStats();
  const maintenance = await DataStore.getMaintenanceStatus();

  // Calculate inventory status distribution
  const inStockCount = Math.max(0, stats.totalProducts - stats.lowStockCount - stats.outOfStockCount);
  const inStockPercent = stats.totalProducts > 0 ? Math.round((inStockCount / stats.totalProducts) * 100) : 0;
  const lowStockPercent = stats.totalProducts > 0 ? Math.round((stats.lowStockCount / stats.totalProducts) * 100) : 0;
  const outOfStockPercent = stats.totalProducts > 0 ? Math.round((stats.outOfStockCount / stats.totalProducts) * 100) : 0;

  // Max value for SVG sales chart normalization
  const maxRevenue = Math.max(...stats.timelineData.map((d) => d.revenue), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Executive Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              CHRONOVA Executive Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] text-gray-500 font-mono">Live Data</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Boshqaruv va Savdo Ko‘rsatkichlari
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/mahsulotlar"
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Yangi Soat</span>
          </Link>
          <Link
            href="/admin/outbox"
            className="px-4 py-2.5 rounded-xl border border-white/[0.12] hover:border-[#D4AF37] bg-white/[0.03] text-xs font-semibold text-gray-200 flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4 text-[#D4AF37]" />
            <span>Telegram Bot</span>
          </Link>
        </div>
      </div>

      {/* Emergency Maintenance Mode Notice Banner */}
      {maintenance.enabled && (
        <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">
                DIQQAT: Do‘konda Texnik Tanaffus Rejimi Faol!
              </span>
              <span className="text-xs text-red-300/90 leading-relaxed block">
                Do‘kon xaridorlar uchun vaqtincha yopilgan. Yuqoridagi &quot;Onlayn Qilish&quot; tugmasi orqali istalgan soniyada qayta ochishingiz mumkin.
              </span>
            </div>
          </div>
          <Link
            href="/admin/sozlamalar"
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold whitespace-nowrap transition-colors self-start sm:self-auto"
          >
            Tanaffus Sababini O‘zgartirish →
          </Link>
        </div>
      )}

      {/* 6 Polished Dashboard KPI Cards Grid (Real Supabase / DataStore metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between shadow-lg group">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Jami Tushum
            </span>
            <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-mono text-lg lg:text-xl font-bold text-white block truncate" title={formatUzs(stats.totalRevenue)}>
              {formatUzs(stats.totalRevenue)}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Real savdolar bo‘yicha</span>
            </span>
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-lg group">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Jami Buyurtmalar
            </span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-white block">
              {stats.totalOrders} <span className="text-xs font-normal text-gray-400">ta</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-1 block">
              Barcha rasmiylashtirilgan
            </span>
          </div>
        </div>

        {/* 3. Total Products */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg group">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Soat Modellari
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
              <Watch className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-white block">
              {stats.totalProducts} <span className="text-xs font-normal text-gray-400">model</span>
            </span>
            <span className="text-[10px] text-[#D4AF37] font-medium mt-1 block">
              100% Shveytsariya katalogi
            </span>
          </div>
        </div>

        {/* 4. Total Customers */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg group">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Mijozlar Bazasi
            </span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-white block">
              {stats.totalCustomers} <span className="text-xs font-normal text-gray-400">mijoz</span>
            </span>
            <span className="text-[10px] text-purple-300 font-medium mt-1 block">
              Unikal xaridorlar
            </span>
          </div>
        </div>

        {/* 5. Pending Orders */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-yellow-500/40 transition-all flex flex-col justify-between shadow-lg group">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Kutilayotgan
            </span>
            <div className="p-2 rounded-xl bg-yellow-500/15 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-yellow-400 block">
              {stats.pendingOrders} <span className="text-xs font-normal text-gray-400">ta</span>
            </span>
            <span className="text-[10px] text-yellow-300/80 font-medium mt-1 block">
              Menejer tasdig‘ida
            </span>
          </div>
        </div>

        {/* 6. Low-Stock Products */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-red-500/40 transition-all flex flex-col justify-between shadow-lg group">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Kam Qolgan (&lt; 5)
            </span>
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-mono text-2xl font-bold text-red-400 block">
              {stats.lowStockCount} <span className="text-xs font-normal text-gray-400">model</span>
            </span>
            <span className="text-[10px] text-red-300/80 font-medium mt-1 block">
              Zaxirani to‘ldirish zarur
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Sales Timeline Chart + Inventory Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Performance Chart (Responsive Bar/Trend) */}
        <div className="lg:col-span-8 bg-[#141414] p-6 rounded-3xl border border-white/[0.08] flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                Savdo Dinamikasi
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                Haftalik Tushum va Buyurtmalar Oqimi
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D4AF37]" />
                <span>Tushum (UZS)</span>
              </span>
              <Link
                href="/admin/analitika"
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>To‘liq hisobot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* SVG Responsive Bar Graph */}
          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-56 px-2">
              {stats.timelineData.map((item, idx) => {
                const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[#D4AF37] mb-1.5 text-center whitespace-nowrap">
                      {formatUzs(item.revenue)}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#D4AF37]/30 to-[#D4AF37] group-hover:brightness-125 transition-all relative cursor-pointer"
                    >
                      <div className="absolute top-1.5 inset-x-0 text-center font-mono text-[9px] text-black font-bold hidden sm:block">
                        {item.orders}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-2 block truncate w-full text-center">
                      {item.label.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center text-xs text-gray-400">
            <span>O‘rtacha chek: <strong className="text-white font-mono">{formatUzs(Math.round(stats.totalRevenue / Math.max(stats.totalOrders, 1)))}</strong></span>
            <span className="text-[11px] text-[#D4AF37]">COSC Sertifikatli Butik</span>
          </div>
        </div>

        {/* Inventory Status Breakdown Card */}
        <div className="lg:col-span-4 bg-[#141414] p-6 rounded-3xl border border-white/[0.08] flex flex-col justify-between space-y-6">
          <div className="pb-4 border-b border-white/[0.08]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
              Zaxira Salomatligi
            </span>
            <h2 className="font-serif text-lg font-bold text-white mt-0.5">
              Omborxona Holati
            </h2>
          </div>

          <div className="space-y-4">
            {/* In Stock */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Yetarli Qoldiq (&ge; 5 dona)</span>
                </span>
                <span className="font-mono font-bold text-white">{inStockCount} ta ({inStockPercent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div style={{ width: `${inStockPercent}%` }} className="h-full bg-emerald-400 rounded-full" />
              </div>
            </div>

            {/* Low Stock */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Kam Qolgan (1 - 4 dona)</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{stats.lowStockCount} ta ({lowStockPercent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div style={{ width: `${lowStockPercent}%` }} className="h-full bg-amber-400 rounded-full" />
              </div>
            </div>

            {/* Out of Stock */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Tugagan (0 dona)</span>
                </span>
                <span className="font-mono font-bold text-red-400">{stats.outOfStockCount} ta ({outOfStockPercent}%)</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div style={{ width: `${outOfStockPercent}%` }} className="h-full bg-red-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-gray-400 space-y-1">
            <span className="font-semibold text-white block">Avtomatik Zaxira Ogohlantirishi</span>
            <span className="text-[11px] block">
              Zaxirasi 3 donadan kamaygan soatlar uchun Telegram botga avtomatik eslatma yuboriladi.
            </span>
          </div>

          <Link
            href="/admin/ombor"
            className="w-full py-2.5 rounded-xl border border-white/[0.1] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-semibold text-center block transition-colors"
          >
            Omborxonani Boshqarish →
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders Table + Top Selling Watches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-[#141414] p-6 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                Oxirgi Harakatlar
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                So‘nggi Buyurtmalar
              </h2>
            </div>
            <Link
              href="/admin/buyurtmalar"
              className="text-xs text-[#D4AF37] hover:text-[#e0c25a] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Barcha buyurtmalar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              Hozircha buyurtmalar mavjud emas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-white/[0.08] pb-2">
                    <th className="py-3 px-2 font-semibold">Buyurtma</th>
                    <th className="py-3 px-2 font-semibold">Mijoz</th>
                    <th className="py-3 px-2 font-semibold">Hudud</th>
                    <th className="py-3 px-2 font-semibold">Summa</th>
                    <th className="py-3 px-2 font-semibold">Status</th>
                    <th className="py-3 px-2 text-right font-semibold">Batafsil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {stats.recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-2 font-mono font-bold text-[#D4AF37]">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 px-2 font-medium text-white">
                        {ord.customer_name}
                        <span className="block text-[10px] text-gray-500 font-mono">{ord.customer_phone}</span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-300">
                        {ord.delivery_region}
                      </td>
                      <td className="py-3.5 px-2 font-mono font-bold text-white">
                        {formatUzs(ord.total_uzs)}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            ord.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : ord.status === 'confirmed'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : ord.status === 'processing'
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                              : ord.status === 'shipped'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : ord.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <Link
                          href={`/admin/buyurtmalar/${ord.id}`}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37] text-white hover:text-black text-xs font-semibold transition-colors"
                        >
                          Ko‘rish
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top-Selling Luxury Watches Ranking */}
        <div className="lg:col-span-4 bg-[#141414] p-6 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                Hit Mahsulotlar
              </span>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                Eng Ko‘p Sotilgan Soatlar
              </h2>
            </div>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <div className="space-y-3">
            {stats.topSellingWatches.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-xs">
                Savdo tarixi shakllanmoqda...
              </div>
            ) : (
              stats.topSellingWatches.map((w, idx) => (
                <div
                  key={w.id}
                  className="p-3 rounded-2xl bg-black/40 border border-white/[0.05] hover:border-[#D4AF37]/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-sm text-[#D4AF37] w-4 text-center">
                      #{idx + 1}
                    </span>
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black border border-white/[0.1] flex-shrink-0">
                      <Image
                        src={w.image}
                        alt={w.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-semibold text-xs text-white block truncate max-w-[130px]">
                        {w.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono block">
                        {w.model_number}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono font-bold text-xs text-white block">
                      {w.unitsSold} dona
                    </span>
                    <span className="text-[10px] text-[#D4AF37] font-mono block">
                      {formatUzs(w.totalRevenueUzs)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/mahsulotlar"
            className="w-full py-2.5 rounded-xl border border-white/[0.1] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-semibold text-center block transition-colors mt-2"
          >
            Katalogdagi Barcha Soatlar →
          </Link>
        </div>
      </div>
    </div>
  );
}
