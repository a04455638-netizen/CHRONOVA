'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Wrench,
  Power,
  AlertTriangle,
} from 'lucide-react';

interface SettingsClientProps {
  hasTelegramConfig: boolean;
  botTokenMasked: string;
  adminChatIdMasked: string;
}

interface MaintenanceData {
  enabled: boolean;
  reason: string;
  updated_at?: string;
}

export default function SettingsClient({
  hasTelegramConfig,
  botTokenMasked,
  adminChatIdMasked,
}: SettingsClientProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  // Maintenance mode state
  const [maintenance, setMaintenance] = useState<MaintenanceData>({
    enabled: false,
    reason: 'Hozirda platformada rejalashtirilgan yangilanish yoki profilaktika ishlari olib borilmoqda. Xarid va buyurtmalar xavfsizligini ta’minlash maqsadida xizmat vaqtincha to‘xtatildi.',
  });
  const [reasonInput, setReasonInput] = useState('');
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/maintenance')
      .then((r) => r.json())
      .then((d) => {
        if (d.maintenance) {
          setMaintenance(d.maintenance);
          setReasonInput(d.maintenance.reason);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleMaintenance = async () => {
    const nextState = !maintenance.enabled;
    const confirmMsg = nextState
      ? '⚠️ Saytda TEXNIK TANAFFUS rejimini yoqmoqchimisiz? Mijozlar do‘konga kira olmaydi va xaridlar to‘xtatiladi.'
      : '✅ Saytni qayta ONLAYN qilmoqchimisiz? Do‘kon mijozlar uchun ochiladi.';

    if (!window.confirm(confirmMsg)) return;

    setLoadingMaintenance(true);
    setMaintenanceMsg(null);

    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState, reason: reasonInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }
      setMaintenance(data.maintenance);
      setMaintenanceMsg({
        type: 'success',
        text: data.message || (nextState ? 'Texnik tanaffus yoqildi' : 'Sayt onlayn rejimga o‘tdi'),
      });
    } catch (err: any) {
      setMaintenanceMsg({ type: 'error', text: err.message });
    } finally {
      setLoadingMaintenance(false);
    }
  };

  const handleSaveReason = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMaintenance(true);
    setMaintenanceMsg(null);

    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: maintenance.enabled, reason: reasonInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Saqlashda xatolik yuz berdi');
      }
      setMaintenance(data.maintenance);
      setMaintenanceMsg({ type: 'success', text: 'Profilaktika xabari muvaffaqiyatli saqlandi!' });
    } catch (err: any) {
      setMaintenanceMsg({ type: 'error', text: err.message });
    } finally {
      setLoadingMaintenance(false);
    }
  };

  const handleTestTelegram = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/telegram-test', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Sinovda xatolik yuz berdi');
      }

      setTestResult({ success: true, message: data.message });
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
          Tizim Konfiguratsiyasi
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
          <Settings className="w-7 h-7 text-[#D4AF37]" />
          <span>Do‘kon va Xavfsizlik Sozlamalari</span>
        </h1>
      </div>

      {/* 1. Maintenance Mode Card (TEXNIK TANAFFUS) */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          maintenance.enabled
            ? 'bg-red-950/20 border-red-500/50 shadow-red-900/10'
            : 'bg-[#141414] border-white/[0.08]'
        } space-y-6`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  maintenance.enabled
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                }`}
              >
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ivory-100">
                Texnik Tanaffus Rejimi (Maintenance Mode)
              </h3>
            </div>
            <p className="text-xs text-graphite-400 mt-1.5 max-w-xl">
              Saytda xatolik yuz berganda yoki rejaviy yangilanishlarda bitta tugma orqali mijozlar uchun xizmatni to‘xtatib turish imkoniyati.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                maintenance.enabled
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${maintenance.enabled ? 'bg-white' : 'bg-emerald-400'}`} />
              <span>{maintenance.enabled ? 'Tanaffus Faol (Do‘kon yopiq)' : 'Do‘kon Onlayn (Faol)'}</span>
            </span>

            <button
              onClick={handleToggleMaintenance}
              disabled={loadingMaintenance}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                maintenance.enabled
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{maintenance.enabled ? 'Saytni Onlayn Qilish' : 'Texnik Tanaffusni Yoqish'}</span>
            </button>
          </div>
        </div>

        {/* Reason Editor */}
        <form onSubmit={handleSaveReason} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-graphite-300 mb-1.5">
              Mijozlarga ko‘rsatiladigan tushuntirish xabari:
            </label>
            <textarea
              rows={3}
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="Profilaktika sababi va taxminiy tiklanish vaqti..."
              className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-4 py-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-500 leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <span className="text-[11px] text-graphite-500">
              Ushbu xabar do‘konga kirgan barcha foydalanuvchilar ekranida aks etadi. Admin panel o‘z ishini davom ettiradi.
            </span>

            <button
              type="submit"
              disabled={loadingMaintenance}
              className="px-5 py-2 rounded-xl border border-graphite-700 hover:border-gold-500 text-xs font-semibold text-ivory-200 transition-colors self-end"
            >
              Xabarni Saqlash
            </button>
          </div>
        </form>

        {maintenanceMsg && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
              maintenanceMsg.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {maintenanceMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{maintenanceMsg.text}</span>
          </div>
        )}
      </div>

      {/* 2. Telegram Bot Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-darkCard border border-graphite-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-graphite-800">
          <div>
            <h3 className="font-serif text-lg font-bold text-ivory-100 flex items-center gap-2">
              <Send className="w-5 h-5 text-gold-500" />
              <span>Telegram Buyurtma Boti</span>
            </h3>
            <p className="text-xs text-graphite-400 mt-1">
              Har bir buyurtma xabari admin chatiga to‘liq ma’lumotlar bilan uzatiladi.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              hasTelegramConfig ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {hasTelegramConfig ? 'Ulangan' : 'Simulyatsiya Rejimi'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-graphite-900 border border-graphite-800 flex justify-between items-center">
            <span className="text-graphite-400">TELEGRAM_BOT_TOKEN:</span>
            <span className="font-mono text-ivory-100 font-medium">{botTokenMasked}</span>
          </div>

          <div className="p-4 rounded-xl bg-graphite-900 border border-graphite-800 flex justify-between items-center">
            <span className="text-graphite-400">TELEGRAM_ADMIN_CHAT_ID:</span>
            <span className="font-mono text-ivory-100 font-medium">{adminChatIdMasked}</span>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{testResult.message || testResult.error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleTestTelegram}
            disabled={testing}
            className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-luxury transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Sinov o‘tkazilmoqda...' : 'Bot Aloqasini Sinash'}</span>
          </button>
        </div>
      </div>

      {/* 3. Security & RLS Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-darkCard border border-graphite-800 space-y-4 text-xs">
        <h3 className="font-serif text-lg font-bold text-ivory-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gold-500" />
          <span>Xavfsizlik va Ma’lumotlar Bazasi</span>
        </h3>
        <p className="text-graphite-400 leading-relaxed">
          Tizim Supabase PostgreSQL Row Level Security (RLS) va atomik zaxira tranzaksiyalari asosida himoyalangan.
          Buyurtma qabul qilinganda mahsulot qoldig‘i xavfsiz qulflanadi va parallel buyurtmalarda nomutanosiblik kelib chiqmaydi.
        </p>
      </div>
    </div>
  );
}
