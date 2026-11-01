'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';
import type { Category, Product } from '@/types';

interface CategoriesClientProps {
  initialCategories: Category[];
  products: Product[];
}

export default function CategoriesClient({
  initialCategories,
  products,
}: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getWatchCount = (categoryId: string) => {
    return products.filter((p) => p.category_id === categoryId || p.category?.id === categoryId).length;
  };

  const handleOpenCreate = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      image_url: '/images/watches/rolex-submariner.jpg',
      display_order: categories.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory({ ...cat });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });
      const data = await res.json();
      if (data.success && data.category) {
        if (editingCategory.id) {
          setCategories(categories.map((c) => (c.id === data.category.id ? data.category : c)));
          showToast('Kategoriya muvaffaqiyatli yangilandi');
        } else {
          setCategories([...categories, data.category]);
          showToast('Yangi kategoriya yaratildi');
        }
        setModalOpen(false);
      } else {
        showToast(data.error || 'Xatolik yuz berdi', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Haqiqatan ham "${name}" kategoriyasini o‘chirmoqchimisiz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter((c) => c.id !== id));
        showToast('Kategoriya o‘chirildi');
      } else {
        showToast('O‘chirishda xatolik', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
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
            Katalog Tuzilmasi
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mt-1">
            <Layers className="w-7 h-7 text-[#D4AF37]" />
            <span>Kategoriyalar Boshqaruvi</span>
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kategoriya</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = getWatchCount(cat.id);
          return (
            <div
              key={cat.id}
              className="bg-[#141414] rounded-3xl border border-white/[0.08] hover:border-[#D4AF37]/40 overflow-hidden shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Category Cover Image Preview */}
                <div className="relative h-44 w-full bg-black">
                  <Image
                    src={cat.image_url || '/images/watches/rolex-submariner.jpg'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent" />

                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono text-[#D4AF37]">
                    <span>{count} ta soat</span>
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                      #{cat.display_order} • Slug: /{cat.slug}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-white">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {cat.description || 'Shveytsariya lyuks soatlari toifasi.'}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cat.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {cat.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-white/[0.08] bg-black/30 flex items-center justify-between">
                <a
                  href={`/katalog?cat=${cat.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                >
                  <span>Do‘konda ko‘rish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                    title="Tahrirlash"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create or Edit Category */}
      {modalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#141414] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingCategory.id ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya Qo‘shish'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Kategoriya Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '');
                    setEditingCategory({
                      ...editingCategory,
                      name,
                      slug: editingCategory.id ? editingCategory.slug : slug,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white"
                  placeholder="Masalan: Klassik va Dress"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white font-mono"
                  placeholder="klassik"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Muqova Rasmi URL manzili
                </label>
                <input
                  type="text"
                  value={editingCategory.image_url || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, image_url: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white font-mono"
                  placeholder="/images/watches/patek-calatrava.jpg"
                />
                {editingCategory.image_url && (
                  <div className="mt-2 relative h-20 w-36 rounded-xl overflow-hidden border border-white/[0.1]">
                    <Image
                      src={editingCategory.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Tavsif (Description)
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] focus:border-[#D4AF37] focus:outline-none text-white"
                  placeholder="Ushbu toifadagi soatlar haqida qisqacha ma'lumot..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Tartib raqami
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingCategory.display_order ?? 1}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        display_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-24 px-3.5 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={editingCategory.is_active ?? true}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#D4AF37] focus:ring-0 bg-black border-white/20"
                  />
                  <label htmlFor="catActive" className="text-gray-300 font-medium">
                    Do‘konda ko‘rsatilsin (Faol)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-gray-300 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider shadow-md"
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
