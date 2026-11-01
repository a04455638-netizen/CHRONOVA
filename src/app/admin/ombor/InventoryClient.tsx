'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  TrendingUp,
  Package,
} from 'lucide-react';
import type { Product } from '@/types';
import { formatUzs } from '@/lib/utils/format';

interface InventoryClientProps {
  initialProducts: Product[];
}

export default function InventoryClient({ initialProducts }: InventoryClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'healthy' | 'low' | 'out'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Metrics
  const totalUnits = products.reduce((sum, p) => sum + p.stock_quantity, 0);
  const totalValuation = products.reduce(
    (sum, p) => sum + p.stock_quantity * (p.sale_price_uzs || p.base_price_uzs),
    0
  );
  const lowStockCount = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity < 5).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;

  const filtered = products.filter((p) => {
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.model_number.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand?.name && p.brand.name.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
    if (filter === 'healthy') matchesFilter = p.stock_quantity >= 5;
    else if (filter === 'low') matchesFilter = p.stock_quantity > 0 && p.stock_quantity < 5;
    else if (filter === 'out') matchesFilter = p.stock_quantity === 0;

    return matchesSearch && matchesFilter;
  });

  const handleUpdateStock = async (productId: string, newStock: number) => {
    const clampedStock = Math.max(0, newStock);
    setUpdatingId(productId);

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, newStock: clampedStock }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(products.map((p) => (p.id === productId ? data.product : p)));
        showToast(`"${data.product.name}" zaxirasi: ${clampedStock} dona`);
      } else {
        showToast(data.error || 'Zaxirani saqlashda xatolik', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
              : 'bg-red-950/90 border-red-500 text-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
            Ombor Boshqaruvi
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
            <Boxes className="w-7 h-7 text-[#D4AF37]" />
            <span>Omborxona va Zaxiralar Nazorati</span>
          </h1>
        </div>

        <div className="text-xs text-gray-400">
          Jami modellar: <strong className="text-white font-mono">{products.length} ta</strong>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Valuation */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-medium">
            Jami Zaxira Qiymati
          </span>
          <span className="font-mono text-xl font-bold text-[#D4AF37] mt-1 block truncate" title={formatUzs(totalValuation)}>
            {formatUzs(totalValuation)}
          </span>
          <span className="text-[10px] text-gray-500 mt-1 block">Ombordagi barcha soatlar bo‘yicha</span>
        </div>

        {/* Total Physical Units */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-medium">
            Mavjud Jami Soatlar
          </span>
          <span className="font-mono text-2xl font-bold text-white mt-1 block">
            {totalUnits} <span className="text-xs font-normal text-gray-400">dona</span>
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Barcha qoldiqlar summasi</span>
        </div>

        {/* Low Stock Warning */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-medium">
            Kam Qolgan Modellar (&lt; 5)
          </span>
          <span className="font-mono text-2xl font-bold text-amber-400 mt-1 block">
            {lowStockCount} <span className="text-xs font-normal text-gray-400">model</span>
          </span>
          <span className="text-[10px] text-amber-300/80 mt-1 block">Shveytsariyadan buyurtma zarur</span>
        </div>

        {/* Out of Stock */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] shadow-lg">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-medium">
            Tugagan Soatlar (0 dona)
          </span>
          <span className="font-mono text-2xl font-bold text-red-400 mt-1 block">
            {outOfStockCount} <span className="text-xs font-normal text-gray-400">model</span>
          </span>
          <span className="text-[10px] text-red-300/80 mt-1 block">Katalogda mavjud emas</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Model, SKU, brend bo‘yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141414] border border-white/[0.08] self-stretch sm:self-auto overflow-x-auto">
          {(['all', 'healthy', 'low', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all'
                ? 'Barchasi'
                : f === 'healthy'
                ? 'Yetarli (≥ 5)'
                : f === 'low'
                ? 'Kam Qolgan (< 5)'
                : 'Tugagan (0)'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#141414] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-black/50 text-gray-400 border-b border-white/[0.08]">
                <th className="py-3.5 px-4 font-semibold">Soat Modeli</th>
                <th className="py-3.5 px-4 font-semibold">SKU / Model</th>
                <th className="py-3.5 px-4 font-semibold">Narx</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Hozirgi Zaxira</th>
                <th className="py-3.5 px-4 text-right font-semibold">Tezkor O‘zgartirish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((watch) => {
                const isUpdating = updatingId === watch.id;
                const price = watch.sale_price_uzs || watch.base_price_uzs;

                let statusBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Yetarli
                  </span>
                );
                if (watch.stock_quantity === 0) {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
                      Tugagan
                    </span>
                  );
                } else if (watch.stock_quantity < 5) {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Kam Qolgan
                    </span>
                  );
                }

                return (
                  <tr key={watch.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/[0.1] flex-shrink-0">
                          <Image
                            src={watch.images?.[0]?.image_url || '/images/watches/rolex-submariner.jpg'}
                            alt={watch.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{watch.name}</span>
                          <span className="text-[10px] text-gray-500 block uppercase">
                            {watch.brand?.name || 'Swiss Watch'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-300">
                      <span className="block text-white font-medium">{watch.sku}</span>
                      <span className="text-[10px] text-gray-500 block">{watch.model_number}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {formatUzs(price)}
                    </td>

                    <td className="py-3.5 px-4">
                      {statusBadge}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono text-base font-bold ${
                          watch.stock_quantity === 0
                            ? 'text-red-400'
                            : watch.stock_quantity < 5
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {watch.stock_quantity} dona
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/[0.08]">
                        <button
                          onClick={() => handleUpdateStock(watch.id, watch.stock_quantity - 1)}
                          disabled={watch.stock_quantity <= 0 || isUpdating}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.1] disabled:opacity-30 transition-colors"
                          title="1 ta ayirish"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={watch.stock_quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              handleUpdateStock(watch.id, val);
                            }
                          }}
                          disabled={isUpdating}
                          className="w-14 text-center py-1 bg-transparent border-0 text-white font-mono text-xs font-bold focus:outline-none"
                        />

                        <button
                          onClick={() => handleUpdateStock(watch.id, watch.stock_quantity + 1)}
                          disabled={isUpdating}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.1] disabled:opacity-30 transition-colors"
                          title="1 ta qo‘shish"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
