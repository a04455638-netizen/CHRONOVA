'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Watch,
  Layers,
  ShoppingBag,
  Users,
  BarChart3,
  Tag,
  MessageSquare,
  Boxes,
  Send,
  Settings,
  Power,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Search,
  Bell,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { AdminAuthUser } from '@/lib/auth/admin-auth';

interface AdminNavClientProps {
  isAuth: boolean;
  user?: AdminAuthUser | null;
  children: React.ReactNode;
}

interface MaintenanceData {
  enabled: boolean;
  reason: string;
}

export default function AdminNavClient({
  isAuth,
  user,
  children,
}: AdminNavClientProps) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuth && pathname !== '/admin/login' && pathname !== '/admin/access-denied') {
      fetch('/api/admin/maintenance')
        .then((r) => r.json())
        .then((d) => {
          if (d.maintenance) setMaintenance(d.maintenance);
        })
        .catch(() => {});
    }
  }, [isAuth, pathname]);

  // If on login or access-denied page, render content directly
  if (pathname === '/admin/login' || pathname === '/admin/access-denied') {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuth) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center p-6 text-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Avtorizatsiya tekshirilmoqda. Login sahifasiga yo‘naltirilmoqda...</p>
        </div>
      </div>
    );
  }

  const handleToggleMaintenance = async () => {
    if (!maintenance) return;
    const nextState = !maintenance.enabled;
    const confirmMsg = nextState
      ? '⚠️ DIQQAT: Saytda TEXNIK TANAFFUS rejimini yoqmoqchimisiz?\n\nDo‘kon tashrif buyuruvchilari uchun xaridlar va barcha sahifalar to‘xtatiladi va ularga profilaktika xabari ko‘rinadi. (Admin panel doimiy ishlayveradi).'
      : '✅ Saytni qayta ISHGA TUSHIRIB, onlayn rejimga o‘tkazmoqchimisiz?\n\nDo‘kon xaridorlar uchun to‘liq ochiladi.';

    if (!window.confirm(confirmMsg)) return;

    setTogglingMaintenance(true);
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        setMaintenance(data.maintenance);
      } else {
        alert('Xatolik: ' + (data.error || 'Amal bajarilmadi'));
      }
    } catch (err: any) {
      alert('Xatolik: ' + err.message);
    } finally {
      setTogglingMaintenance(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch {
      // ignore
    }
    window.location.href = '/admin/login';
  };

  // 11 Sidebar Items as specified in Phase 2
  const menuItems = [
    { href: '/admin', label: 'Overview', uzLabel: 'Boshqaruv (KPI)', icon: LayoutDashboard },
    { href: '/admin/mahsulotlar', label: 'Products', uzLabel: 'Mahsulotlar', icon: Watch },
    { href: '/admin/kategoriyalar', label: 'Categories', uzLabel: 'Kategoriyalar', icon: Layers },
    { href: '/admin/buyurtmalar', label: 'Orders', uzLabel: 'Buyurtmalar', icon: ShoppingBag },
    { href: '/admin/mijozlar', label: 'Customers', uzLabel: 'Mijozlar', icon: Users },
    { href: '/admin/analitika', label: 'Analytics', uzLabel: 'Analitika', icon: BarChart3 },
    { href: '/admin/kuponlar', label: 'Discounts', uzLabel: 'Kupon & Chegirmalar', icon: Tag },
    { href: '/admin/sharhlar', label: 'Reviews', uzLabel: 'Sharhlar', icon: MessageSquare },
    { href: '/admin/ombor', label: 'Inventory', uzLabel: 'Omborxona', icon: Boxes },
    { href: '/admin/outbox', label: 'Notifications', uzLabel: 'Telegram Outbox', icon: Send },
    { href: '/admin/sozlamalar', label: 'Settings', uzLabel: 'Sozlamalar', icon: Settings },
  ];

  const currentSection = menuItems.find((m) => {
    if (m.href === '/admin') return pathname === '/admin';
    return pathname.startsWith(m.href);
  }) || { label: 'Dashboard', uzLabel: 'Boshqaruv' };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col lg:flex-row font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Mobile Header Bar */}
      <div className="lg:hidden h-16 bg-[#141414] border-b border-white/[0.08] px-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-colors"
            aria-label="Menyuni ochish"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#D4AF37]">
              CHRONOVA
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>

        {/* Quick maintenance pill on mobile */}
        {maintenance && (
          <button
            onClick={handleToggleMaintenance}
            disabled={togglingMaintenance}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              maintenance.enabled
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{maintenance.enabled ? 'Tanaffusda' : 'Onlayn'}</span>
          </button>
        )}
      </div>

      {/* Desktop Sidebar (Dark Charcoal #141414, Elegant Champagne Gold Accents) */}
      <aside className="hidden lg:flex w-64 bg-[#141414] border-r border-white/[0.08] flex-col justify-between flex-shrink-0 sticky top-0 h-screen z-20">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand Header */}
          <div className="p-6 pb-5 border-b border-white/[0.08]">
            <Link href="/admin" className="flex items-center justify-between group">
              <div>
                <span className="font-serif text-xl font-bold tracking-[0.22em] text-white group-hover:text-[#D4AF37] transition-colors block">
                  CHRONOVA
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#D4AF37] font-medium block mt-0.5">
                  Haute Horlogerie • SaaS
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>

          {/* Navigation Links Scrollable Canvas */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Boshqaruv Bo‘limlari
            </div>
            {menuItems.map((item) => {
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all group ${
                    active
                      ? 'bg-[#D4AF37] text-black font-semibold shadow-md shadow-[#D4AF37]/15'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        active ? 'text-black' : 'text-gray-400 group-hover:text-[#D4AF37]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] opacity-75 font-normal ${
                      active ? 'text-black/80' : 'text-gray-500 group-hover:text-gray-400'
                    }`}
                  >
                    {item.uzLabel}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer User Info & Security Badge */}
          <div className="p-3.5 border-t border-white/[0.08] bg-[#111111] space-y-2">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-bold font-serif">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-medium text-white block truncate max-w-[120px]">
                    {user?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-mono">
                    {user?.role || 'admin'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Tizimdan chiqish"
                className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between px-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RLS & Auth Active</span>
              </span>
              <span className="font-mono text-[9px] text-gray-600">v2.4 Pro</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer (Responsive Navigation) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#141414] p-5 flex flex-col justify-between border-r border-white/[0.08] z-50 shadow-2xl">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#D4AF37]">
                    CHRONOVA
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-semibold uppercase">
                    Admin
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="py-4 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto">
                {menuItems.map((item) => {
                  const active =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                        active
                          ? 'bg-[#D4AF37] text-black font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] opacity-75">{item.uzLabel}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-gray-300 border border-white/[0.1] hover:border-[#D4AF37] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Do‘konni Ko‘rish</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Content Canvas with Universal Top Navigation Bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#090909]">
        {/* Enterprise Top Navigation Bar */}
        <header className="hidden lg:flex h-16 bg-[#141414]/90 border-b border-white/[0.08] px-8 items-center justify-between backdrop-blur-md sticky top-0 z-10">
          {/* Breadcrumb / Current Location */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">CHRONOVA Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-semibold text-white">
              {currentSection.label}
            </span>
            <span className="text-[11px] text-[#D4AF37] font-normal">
              ({currentSection.uzLabel})
            </span>
          </div>

          {/* Global Search Bar */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Qidiruv: soatlar, buyurtmalar, mijozlar..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/[0.1] hover:border-white/20 focus:border-[#D4AF37] focus:outline-none text-xs text-white placeholder-gray-500 transition-colors"
            />
            {searchFocused && searchQuery.trim() !== '' && (
              <div className="absolute top-full mt-2 inset-x-0 bg-[#181818] border border-white/[0.1] rounded-2xl p-3 shadow-2xl z-30 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 block">
                  Tezkor O‘tish
                </span>
                <Link
                  href={`/admin/mahsulotlar?search=${encodeURIComponent(searchQuery)}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-xs text-white"
                >
                  <span className="flex items-center gap-2">
                    <Watch className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Mahsulotlarda &quot;{searchQuery}&quot;</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
                <Link
                  href={`/admin/buyurtmalar?search=${encodeURIComponent(searchQuery)}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.05] text-xs text-white"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Buyurtmalarda &quot;{searchQuery}&quot;</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Controls: Maintenance Mode, Store Link, Notification, Admin Profile */}
          <div className="flex items-center gap-4">
            {/* 1-Click Maintenance Mode Toggle Switch */}
            {maintenance && (
              <div className="flex items-center gap-3 p-1 pl-3 pr-1.5 rounded-2xl bg-black/60 border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      maintenance.enabled ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-xs font-medium">
                    {maintenance.enabled ? (
                      <span className="text-red-400 font-semibold text-[11px]">Tanaffusda</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold text-[11px]">Sayt Onlayn</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={handleToggleMaintenance}
                  disabled={togglingMaintenance}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    maintenance.enabled
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                  }`}
                  title={maintenance.enabled ? 'Saytni qayta ochish' : 'Saytni texnik tanaffusga o‘tkazish'}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>
                    {togglingMaintenance
                      ? 'Yangilanmoqda...'
                      : maintenance.enabled
                      ? 'Onlayn Qilish'
                      : 'Texnik Tanaffus'}
                  </span>
                </button>
              </div>
            )}

            <div className="h-5 w-px bg-white/[0.08]" />

            {/* Notification Indicator Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors relative"
                title="Bildirishnomalar"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#181818] border border-white/[0.1] rounded-2xl p-4 shadow-2xl z-30 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                    <span className="text-xs font-bold text-white">Bildirishnomalar</span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold">Barchasi ko‘rilgan</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
                      <span className="font-semibold text-white block">Telegram Bot Faol</span>
                      <span className="text-[10px] text-gray-400">Yangi buyurtmalar avtomatik @CHRONOVA_admin_bot ga yuboriladi.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.05]">
                      <span className="font-semibold text-white block">RLS Himoya Rejimi</span>
                      <span className="text-[10px] text-gray-400">Barcha API va ma’lumotlar server-side autentifikatsiyadan o‘tmoqda.</span>
                    </div>
                  </div>
                  <Link
                    href="/admin/outbox"
                    onClick={() => setNotificationOpen(false)}
                    className="block text-center text-[11px] text-[#D4AF37] hover:underline pt-1"
                  >
                    Telegram Outbox Loglarini Ko‘rish →
                  </Link>
                </div>
              )}
            </div>

            {/* Storefront External Shortcut */}
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-xl text-gray-400 hover:text-[#D4AF37] hover:bg-white/[0.05] transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Do‘kon sahifasini yangi oynada ochish"
            >
              <span>Do‘kon</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.08]"
              >
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-bold font-serif">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <div className="text-left hidden xl:block">
                  <span className="text-xs font-semibold text-white block leading-tight">
                    {user?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    {user?.email || 'admin@chronova.uz'}
                  </span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#181818] border border-white/[0.1] rounded-2xl p-2 shadow-2xl z-30 space-y-1">
                  <div className="p-3 border-b border-white/[0.08]">
                    <span className="text-xs font-bold text-white block">{user?.name || 'CHRONOVA Admin'}</span>
                    <span className="text-[11px] text-gray-400 block font-mono truncate">{user?.email || 'admin@chronova.uz'}</span>
                    <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-semibold uppercase tracking-wider">
                      Bosh Administrator
                    </span>
                  </div>

                  <Link
                    href="/admin/sozlamalar"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tizim Sozlamalari</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Tizimdan Chiqish</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090909]">
          {children}
        </main>
      </div>
    </div>
  );
}
