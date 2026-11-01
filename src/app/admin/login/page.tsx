'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@chronova.uz');
  const [password, setPassword] = useState('ChronovaAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kirish muvaffaqiyatsiz bo‘ldi');
      }

      // Use hard navigation to ensure fresh session cookies are evaluated by server components
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#141414] border border-white/[0.1] rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-serif text-3xl font-bold tracking-[0.22em] text-white block">
            CHRONOVA
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold block">
            Boshqaruv Paneli
          </span>
          <p className="text-xs text-gray-400 pt-1">
            Faqat vakolatli xodimlar va boshqaruvchilar uchun
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Parol
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[11px] text-[#D4AF37]">
            Standart demo login: <code>admin@chronova.uz</code><br />
            Standart demo parol: <code>ChronovaAdmin2026!</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all"
          >
            <span>{loading ? 'Tekshirilmoqda...' : 'Tizimga Kirish'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors">
            ← Asosiy saytga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
