'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Product, Brand, Category } from '@/types';
import { formatUzs } from '@/lib/utils/format';

interface AdminProductsClientProps {
  initialProducts: Product[];
  brands: Brand[];
  categories: Category[];
}

export default function AdminProductsClient({
  initialProducts,
  brands,
  categories,
}: AdminProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState(brands[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [modelNumber, setModelNumber] = useState('');
  const [sku, setSku] = useState('');
  const [basePrice, setBasePrice] = useState(15000000);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [stock, setStock] = useState(5);
  const [movement, setMovement] = useState<'Avtomatik' | 'Mexanik' | 'Kvarts'>('Avtomatik');
  const [caseMaterial, setCaseMaterial] = useState('316L Zanglamas po‘lat');
  const [caseDiameter, setCaseDiameter] = useState(41);
  const [waterproof, setWaterproof] = useState(5);
  const [crystal, setCrystal] = useState<'Sapfir' | 'Mineral' | 'Xezalit'>('Sapfir');
  const [strap, setStrap] = useState('Po‘lat bilaguzuk');
  const [dialColor, setDialColor] = useState('Qora');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [saving, setSaving] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBrandId(brands[0]?.id || '');
    setCategoryId(categories[0]?.id || '');
    setModelNumber(`REF-${Math.floor(1000 + Math.random() * 9000)}`);
    setSku(`SKU-${Math.floor(10000 + Math.random() * 90000)}`);
    setBasePrice(15000000);
    setSalePrice('');
    setStock(5);
    setMovement('Avtomatik');
    setCaseMaterial('316L Zanglamas po‘lat');
    setCaseDiameter(41);
    setWaterproof(5);
    setCrystal('Sapfir');
    setStrap('Po‘lat bilaguzuk');
    setDialColor('Qora');
    setImageUrl('/images/watches/rolex-submariner.jpg');
    setDescription('Shveytsariya lyuks soati tavsifi.');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrandId(p.brand_id);
    setCategoryId(p.category_id);
    setModelNumber(p.model_number);
    setSku(p.sku);
    setBasePrice(p.base_price_uzs);
    setSalePrice(p.sale_price_uzs || '');
    setStock(p.stock_quantity);
    setMovement(p.movement_type as any);
    setCaseMaterial(p.case_material);
    setCaseDiameter(p.case_diameter_mm);
    setWaterproof(p.water_resistance_atm);
    setCrystal(p.crystal_type as any);
    setStrap(p.strap_material);
    setDialColor(p.dial_color);
    setImageUrl(p.images?.[0]?.image_url || '');
    setDescription(p.description);
    setIsPublished(p.is_published);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: Partial<Product> = {
        id: editingProduct ? editingProduct.id : undefined,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        brand_id: brandId,
        category_id: categoryId,
        model_number: modelNumber,
        sku,
        base_price_uzs: Number(basePrice),
        sale_price_uzs: salePrice ? Number(salePrice) : null,
        stock_quantity: Number(stock),
        movement_type: movement,
        case_material: caseMaterial,
        case_diameter_mm: Number(caseDiameter),
        water_resistance_atm: Number(waterproof),
        crystal_type: crystal,
        strap_material: strap,
        dial_color: dialColor,
        description,
        is_published: isPublished,
        images: [
          {
            id: `img-${Date.now()}`,
            product_id: editingProduct?.id || '',
            image_url: imageUrl.trim() || '/images/watches/rolex-submariner.jpg',
            alt_text: name,
            display_order: 1,
            is_primary: true,
          },
        ],
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.product) {
        throw new Error(data.error || 'Saqlashda xatolik yuz berdi');
      }

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === data.product.id ? data.product : p)));
      } else {
        setProducts([data.product, ...products]);
      }

      setModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, watchName: string) => {
    if (!confirm(`Haqiqatan ham "${watchName}" soatini butkul o‘chirmoqchimisiz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('O‘chirishda xatolik yuz berdi');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
            Katalog Boshqaruvi
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Soatlar Ro‘yxati ({products.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Yangi Soat Yaratish</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-[#141414] p-4 rounded-2xl border border-white/[0.08]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, model yoki SKU bo‘yicha qidirish..."
            className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#141414] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-black/50 text-gray-400 border-b border-white/[0.08]">
                <th className="p-4 font-semibold">Soat</th>
                <th className="p-4 font-semibold">Brend & Ref</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Narxi (UZS)</th>
                <th className="p-4 font-semibold">Zaxira</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filtered.map((prod) => {
                const img = prod.images?.[0]?.image_url || '/images/watches/rolex-submariner.jpg';
                return (
                  <tr key={prod.id} className="hover:bg-graphite-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-graphite-950 flex-shrink-0">
                        <TableProductImage src={img} alt={prod.name} />
                      </div>
                      <div>
                        <span className="font-semibold text-ivory-100 block line-clamp-1">{prod.name}</span>
                        <span className="text-[10px] text-graphite-400">{prod.movement_type} • {prod.case_diameter_mm}mm</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gold-400 block">{prod.brand?.name || 'Rolex'}</span>
                      <span className="text-[10px] text-graphite-400 font-mono">{prod.model_number}</span>
                    </td>
                    <td className="p-4 font-mono text-graphite-300">
                      {prod.sku}
                    </td>
                    <td className="p-4 font-mono font-bold text-ivory-100">
                      {formatUzs(prod.sale_price_uzs || prod.base_price_uzs)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded ${
                          prod.stock_quantity <= 3 ? 'bg-red-500/20 text-red-400' : 'text-ivory-100'
                        }`}
                      >
                        {prod.stock_quantity} dona
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          prod.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {prod.is_published ? 'Faol' : 'Qoralama'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg bg-graphite-800 hover:bg-gold-500 text-ivory-100 transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 rounded-lg bg-graphite-800 hover:bg-red-500 text-ivory-100 transition-colors"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-darkCard w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-gold-500/30 my-8 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-graphite-800 mb-6">
              <h3 className="font-serif text-lg font-bold text-ivory-100">
                {editingProduct ? 'Soatni Tahrirlash' : 'Yangi Soat Yaratish'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-graphite-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">Soat Nomi *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rolex Submariner Date 41mm"
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">Brend *</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">Model (Ref) *</label>
                  <input
                    type="text"
                    required
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">Kategoriya *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">Asosiy Narx (UZS) *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">Chegirma Narxi (UZS)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-graphite-300 font-semibold mb-1">Ombordagi Zaxira *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-graphite-300 font-semibold mb-1">Rasm URL manzili *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-graphite-300 font-semibold mb-1">Batafsil Tavsif</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-graphite-900 border border-graphite-700 rounded-xl px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-gold-500"
                />
                <label htmlFor="published" className="text-graphite-300 font-medium cursor-pointer">
                  Do‘konda darhol e’lon qilinsin (Published)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-graphite-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-graphite-700 text-graphite-300 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold uppercase"
                >
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TableProductImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setImgSrc('/images/watches/rolex-submariner.jpg')}
    />
  );
}
