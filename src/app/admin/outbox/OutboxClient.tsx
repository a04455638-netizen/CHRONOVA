'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle, RefreshCw, Clock, ShieldCheck } from 'lucide-react';
import { NotificationOutboxItem } from '@/types';
import { formatDateTime } from '@/lib/utils/format';

interface OutboxClientProps {
  initialLogs: NotificationOutboxItem[];
}

export default function OutboxClient({ initialLogs }: OutboxClientProps) {
  const [logs, setLogs] = useState<NotificationOutboxItem[]>(initialLogs);
  const [dispatching, setDispatching] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  const handleDispatch = async () => {
    setDispatching(true);
    setResultMsg('');

    try {
      const res = await fetch('/api/telegram/dispatch', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');

      setResultMsg(`Muvaffaqiyatli: ${data.sentCount} ta xabar yuborildi.`);
    } catch (err: any) {
      setResultMsg(`Xatolik: ${err.message}`);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
            Ishonchli Bildirishnomalar
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
            <Send className="w-7 h-7 text-[#D4AF37]" />
            <span>Telegram Notification Outbox</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Har bir buyurtma avtomatik outbox navbatiga yoziladi va Telegram Bot API orqali administratorga yetkaziladi.
          </p>
        </div>

        <button
          onClick={handleDispatch}
          disabled={dispatching}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${dispatching ? 'animate-spin' : ''}`} />
          <span>{dispatching ? 'Uzatilmoqda...' : 'Navbatni Qayta Ishlash'}</span>
        </button>
      </div>

      {resultMsg && (
        <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{resultMsg}</span>
        </div>
      )}

      {/* Outbox Table */}
      <div className="bg-[#141414] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-black/50 text-gray-400 border-b border-white/[0.08]">
                <th className="p-4 font-semibold">Kanal</th>
                <th className="p-4 font-semibold">Buyurtma</th>
                <th className="p-4 font-semibold">Mijoz & Tel</th>
                <th className="p-4 font-semibold">Urinishlar</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-graphite-500">
                    Hozircha outbox xabarlari mavjud emas. Yangi buyurtma kelganda bu yerda ko‘rinadi.
                  </td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item.id} className="hover:bg-graphite-900/40 transition-colors">
                    <td className="p-4 uppercase font-bold text-gold-400 font-mono">
                      {item.channel}
                    </td>
                    <td className="p-4 font-mono font-bold text-ivory-100">
                      {item.payload?.order_number || item.id}
                    </td>
                    <td className="p-4 text-graphite-300">
                      <span className="font-semibold block text-ivory-100">{item.payload?.customer_name}</span>
                      <span className="font-mono text-[11px] text-graphite-400">{item.payload?.customer_phone}</span>
                    </td>
                    <td className="p-4 font-mono">
                      {item.attempts}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'sent'
                            ? 'bg-green-500/20 text-green-400'
                            : item.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.last_error && (
                        <span className="block text-[10px] text-red-400 mt-1 max-w-xs truncate">
                          {item.last_error}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-graphite-400 font-mono text-[11px]">
                      {formatDateTime(item.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
