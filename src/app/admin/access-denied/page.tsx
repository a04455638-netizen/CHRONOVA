'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

export default function AccessDeniedPage() {
  const handleSwitchAccount = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch {
      // ignore
    }
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-[#141414] border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Security Shield Icon */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-red-400 block mb-2">
          403 — Access Denied • Ruxsat Berilmadi
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
          Administratorlik Huquqi Mavjud Emas
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-8">
          Siz tizimga muvaffaqiyatli kirgansiz, biroq hisobingizda CHRONOVA boshqaruv markaziga kirish uchun talab qilinadigan <strong className="text-white">Admin</strong> yoki <strong className="text-white">Manager</strong> roli tasdiqlanmagan. Do‘konga qaytishingiz yoki vakolatli administrator login ma’lumotlari bilan qayta kirishingiz mumkin.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Do‘konga Qaytish</span>
          </Link>

          <button
            onClick={handleSwitchAccount}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/20 hover:border-red-400/50 text-gray-300 hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Hisobni Almashtirish</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>CHRONOVA Haute Horlogerie Security Guard</span>
        </div>
      </div>
    </div>
  );
}
