'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
} from 'lucide-react';
import type { Coupon } from '@/types';
import { formatUzs } from '@/lib/utils/format';

interface CouponsClientProps {
  initialCoupons: Coupon[];
}

export default function CouponsClient({ initialCoupons }: CouponsClientProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(10000000);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount_type: discountType,
          discount_value: Number(discountValue),
          min_order_amount_uzs: Number(minOrder),
          max_uses: Number(maxUses),
        }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setCoupons([data.coupon, ...coupons]);
        showToast(`"${data.coupon.code}" kuponi muvaffaqiyatli yaratildi`);
        setModalOpen(false);
        setCode('');
      } else {
        showToast(data.error || 'Kupon yaratishda xatolik', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`Haqiqatan ham "${couponCode}" kuponini o‘chirmoqchimisiz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter((c) => c.id !== id));
        showToast('Kupon o‘chirildi');
      } else {
        showToast('O‘chirishda xatolik', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
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
            Aksiya va Chegirmalar
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
            <Tag className="w-7 h-7 text-[#D4AF37]" />
            <span>Kupon va Promokodlar</span>
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kupon Yaratish</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#141414] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-black/50 text-gray-400 border-b border-white/[0.08]">
                <th className="p-4 font-semibold">Kupon Kodi</th>
                <th className="p-4 font-semibold">Turi</th>
                <th className="p-4 font-semibold">Chegirma Miqdori</th>
                <th className="p-4 font-semibold">Minimal Xarid</th>
                <th className="p-4 font-semibold">Ishlatildi / Limit</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono font-bold text-[#D4AF37] text-sm">
                    {c.code}
                  </td>
                  <td className="p-4 text-gray-300">
                    {c.discount_type === 'percentage' ? 'Foiz (%)' : 'Aniq Summa (UZS)'}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {c.discount_type === 'percentage'
                      ? `${c.discount_value}%`
                      : formatUzs(c.discount_value)}
                  </td>
                  <td className="p-4 font-mono text-gray-300">
                    {formatUzs(c.min_order_amount_uzs)}
                  </td>
                  <td className="p-4 font-mono text-gray-300">
                    {c.current_uses} / {c.max_uses || '∞'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {c.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Yangi Kupon Kodini Kiritish
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Kupon Kodi (Katta harflarda) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="LUXURY2026 yoki CHRONOVA15"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Chegirma Turi *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white"
                  >
                    <option value="percentage">Foiz (%)</option>
                    <option value="fixed">Aniq Summa (UZS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    {discountType === 'percentage' ? 'Foiz stavkasi (%)' : 'Qiymati (UZS)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Minimal Xarid Miqdori (UZS) *
                </label>
                <input
                  type="number"
                  required
                  step="100000"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Maksimal Ishlatish Soni (Limit)
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-gray-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider shadow-md"
                >
                  {loading ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
