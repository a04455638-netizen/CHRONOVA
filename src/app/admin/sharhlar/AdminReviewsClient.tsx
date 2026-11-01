'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Review } from '@/types';
import { formatDateTime } from '@/lib/utils/format';

interface AdminReviewsClientProps {
  initialReviews: Review[];
}

export default function AdminReviewsClient({ initialReviews }: AdminReviewsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
          Mijozlar Fikrlari
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
          <MessageSquare className="w-7 h-7 text-[#D4AF37]" />
          <span>Sharhlar Moderatsiyasi</span>
        </h1>
      </div>

      <div className="bg-[#141414] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-black/50 text-gray-400 border-b border-white/[0.08]">
              <th className="p-4 font-semibold">Mijoz</th>
              <th className="p-4 font-semibold">Baho</th>
              <th className="p-4 font-semibold">Fikr matni</th>
              <th className="p-4 font-semibold">Sana</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-graphite-900/40 transition-colors">
                <td className="p-4 font-semibold text-ivory-100">
                  {r.customer_name}
                </td>
                <td className="p-4">
                  <div className="flex text-gold-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </td>
                <td className="p-4 text-graphite-300 max-w-md">
                  {r.title && <span className="font-bold block text-ivory-100">{r.title}</span>}
                  <p className="line-clamp-2">{r.comment}</p>
                </td>
                <td className="p-4 text-graphite-400 font-mono text-[11px]">
                  {formatDateTime(r.created_at)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.status === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : r.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdate(r.id, 'approved')}
                      className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors"
                      title="Tasdiqlash"
                    >
                      Tasdiqlash
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdate(r.id, 'rejected')}
                      className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Rad etish"
                    >
                      Rad etish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
