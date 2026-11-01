'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Wrench, Clock, Phone, ShieldCheck, RefreshCw, Sparkles, Lock } from 'lucide-react';

interface MaintenanceInfo {
  enabled: boolean;
  reason: string;
}

export default function MaintenanceOverlay() {
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState<MaintenanceInfo | null>(null);
  const [checking, setChecking] = useState(false);

  // Never block admin panel routes
  const isAdminRoute = pathname?.startsWith('/admin');

  const checkStatus = async () => {
    try {
      setChecking(true);
      const res = await fetch('/api/maintenance', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMaintenance(data);
      }
    } catch (e) {
      // Ignore network errors
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Periodically poll so the storefront unblocks automatically when admin turns it off
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [pathname]);

  if (isAdminRoute || !maintenance?.enabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-graphite-950/98 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Background Luxury Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-surface-darkCard/95 border border-gold-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-8 my-auto">
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 mx-auto shadow-luxury animate-pulse">
            <Wrench className="w-8 h-8 text-gold-400" />
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-gold-400/90 font-semibold block">
              CHRONOVA HAUTE HORLOGERIE
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-ivory-100 mt-2">
              Texnik Tanaffus &amp; Profilaktika
            </h1>
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Tizimda rejaviy optimallashtirish ishlari olib borilmoqda</span>
        </div>

        {/* Reason / Notice Box */}
        <div className="p-5 rounded-2xl bg-graphite-900/90 border border-graphite-800 text-xs sm:text-sm text-ivory-300 leading-relaxed max-w-xl mx-auto shadow-inner">
          <p>{maintenance.reason}</p>
          <div className="mt-3 pt-3 border-t border-graphite-800/80 flex items-center justify-center gap-2 text-[11px] text-graphite-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>Mijozlar buyurtmalari va xavfsizligi to‘liq muhofaza qilingan</span>
          </div>
        </div>

        {/* Concierge & Support Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <div className="p-4 rounded-xl bg-graphite-900/50 border border-graphite-800 flex items-start gap-3">
            <Phone className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-graphite-400 font-semibold block">
                24/7 Butik Konsyerj
              </span>
              <a href="tel:+998712009090" className="text-xs font-semibold text-ivory-100 hover:text-gold-400 transition-colors">
                +998 (71) 200 90 90
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-graphite-900/50 border border-graphite-800 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-graphite-400 font-semibold block">
                Rasmiy Kafolat
              </span>
              <span className="text-xs text-ivory-200">
                Barcha faol buyurtmalar reja bo‘yicha yetkaziladi
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            disabled={checking}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-luxury transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Tekshirilmoqda...' : 'Sahifani Qayta Yuklash'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
